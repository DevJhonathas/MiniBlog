import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import styles from "./Search.module.css";

import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import PostDetail from "../../components/PostDetail";

const normalizeText = (text) => {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const extractText = (html) => {
  if (!html) return "";

  return (
    new DOMParser().parseFromString(String(html), "text/html").body
      .textContent || ""
  );
};

const getDate = (date) => {
  if (!date) return 0;

  const parsedDate =
    typeof date.toDate === "function" ? date.toDate() : new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") || "";

  const [query, setQuery] = useState(search);

  const { documents: posts, loading, error } = useFetchDocuments("posts");

  useEffect(() => {
    setQuery(search);
  }, [search]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = normalizeText(search);

    if (!normalizedQuery) return [];

    const terms = normalizedQuery
      .split(/\s+/)
      .map((term) => term.replace(/^#+/, ""))
      .filter(Boolean);

    return (posts || [])
      .filter((post) => post.status !== "draft")
      .filter((post) => {
        const tags = Array.isArray(post.tags) ? post.tags : [];

        const searchableContent = normalizeText(
          [
            post.title,
            extractText(post.body),
            ...tags,
            ...tags.map((tag) => `#${tag}`),
          ].join(" "),
        );

        return terms.every((term) => searchableContent.includes(term));
      })
      .sort((a, b) => getDate(b.createdAt) - getDate(a.createdAt));
  }, [posts, search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: cleanQuery });
  };

  return (
    <main className={styles.search_container}>
      <header className={styles.search_header}>
        <span className={styles.eyebrow}>EXPLORE O MINIBLOG</span>

        <h1>Encontre uma publicação</h1>

        <p>
          Pesquise por títulos, assuntos, palavras ou tags e descubra conteúdos
          compartilhados pela comunidade.
        </p>

        <form className={styles.search_form} onSubmit={handleSubmit}>
          <span className={styles.search_icon} aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            placeholder="O que você está procurando?"
            aria-label="Pesquisar publicações"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit" disabled={!query.trim()}>
            Pesquisar
          </button>
        </form>
      </header>

      <section className={styles.results_section}>
        {search.trim() && !loading && !error && (
          <div className={styles.results_header}>
            <div>
              <span className={styles.section_eyebrow}>
                RESULTADOS DA PESQUISA
              </span>

              <h2>
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1
                  ? "publicação encontrada"
                  : "publicações encontradas"}
              </h2>
            </div>

            <span className={styles.search_term}>Busca: {search}</span>
          </div>
        )}

        {loading && (
          <div className={styles.state}>
            <span className={styles.spinner}></span>
            <p>Buscando publicações...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.empty_state}>
            <span className={styles.empty_icon}>!</span>
            <h2>Não foi possível realizar a pesquisa</h2>
            <p>Tente novamente em alguns instantes.</p>

            <Link to="/" className={styles.back_button}>
              Voltar ao início
            </Link>
          </div>
        )}

        {!loading && !error && !search.trim() && (
          <div className={styles.empty_state}>
            <span className={styles.empty_icon}>⌕</span>
            <h2>O que você deseja encontrar?</h2>
            <p>Digite uma palavra, título ou tag para começar sua pesquisa.</p>
          </div>
        )}

        {!loading && !error && search.trim() && filteredPosts.length > 0 && (
          <div className={styles.posts_grid}>
            {filteredPosts.map((post) => (
              <PostDetail key={post.id} post={post} />
            ))}
          </div>
        )}

        {!loading && !error && search.trim() && filteredPosts.length === 0 && (
          <div className={styles.empty_state}>
            <span className={styles.empty_icon}>?</span>
            <h2>Nenhuma publicação encontrada</h2>
            <p>
              Não encontramos resultados para "{search}". Experimente utilizar
              outras palavras ou pesquisar por uma tag diferente.
            </p>

            <Link to="/" className={styles.back_button}>
              Explorar outras publicações
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Search;
