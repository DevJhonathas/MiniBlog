import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import PostDetail from "../../components/PostDetail";

import styles from "./Home.module.css";

const getDate = (date) => {
  if (!date) return 0;

  const parsedDate =
    typeof date.toDate === "function" ? date.toDate() : new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
};

const Home = () => {
  const [query, setQuery] = useState("");
  const { documents: posts, loading, error } = useFetchDocuments("posts");

  const navigate = useNavigate();

  const publishedPosts = useMemo(() => {
    return (posts || [])
      .filter((post) => post.status !== "draft")
      .sort((a, b) => getDate(b.createdAt) - getDate(a.createdAt));
  }, [posts]);

  const totalTags = useMemo(() => {
    const tags = publishedPosts.flatMap((post) =>
      Array.isArray(post.tags) ? post.tags : [],
    );

    return new Set(tags.map((tag) => tag.toLowerCase())).size;
  }, [publishedPosts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const search = query.trim();

    if (search) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.hero_content}>
          <span className={styles.eyebrow}>
            UM ESPAÇO PARA COMPARTILHAR IDEIAS
          </span>

          <h1>
            Ideias merecem ser
            <span> compartilhadas.</span>
          </h1>

          <p>
            Descubra conteúdos, explore diferentes perspectivas e compartilhe
            seus conhecimentos com a comunidade do MiniBlog.
          </p>

          <div className={styles.hero_actions}>
            <a href="#publicacoes" className={styles.primary_button}>
              Explorar publicações
              <span aria-hidden="true">→</span>
            </a>

            <Link to="/post/create" className={styles.secondary_button}>
              Criar publicação
            </Link>
          </div>
        </div>

        <div className={styles.hero_decoration} aria-hidden="true">
          <div className={styles.decoration_card}>
            <span className={styles.decoration_icon}>✦</span>
            <span>Compartilhe suas ideias</span>
            <strong>Uma publicação pode inspirar muitas pessoas.</strong>
            <div className={styles.decoration_line}></div>
            <div className={styles.decoration_line_short}></div>
          </div>
          <div className={styles.decoration_circle}></div>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.overview_item}>
          <span className={styles.overview_icon}>▤</span>
          <div>
            <strong>{loading ? "—" : publishedPosts.length}</strong>
            <span>Publicações disponíveis</span>
          </div>
        </div>

        <div className={styles.overview_item}>
          <span className={styles.overview_icon}>#</span>
          <div>
            <strong>{loading ? "—" : totalTags}</strong>
            <span>Assuntos explorados</span>
          </div>
        </div>

        <div className={styles.overview_message}>
          <span>Uma boa ideia merece espaço.</span>
          <Link to="/post/create">Compartilhe a sua →</Link>
        </div>
      </section>

      <section className={styles.publications} id="publicacoes">
        <div className={styles.section_header}>
          <div>
            <span className={styles.section_eyebrow}>DESCUBRA CONTEÚDOS</span>
            <h2>Publicações recentes</h2>
            <p>
              Ideias, experiências e conhecimentos compartilhados pela
              comunidade.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.search_form}>
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              placeholder="Buscar por título ou tag..."
              aria-label="Buscar publicações"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button type="submit" aria-label="Pesquisar">
              Buscar
            </button>
          </form>
        </div>

        {loading && (
          <div className={styles.loading_state}>
            <span className={styles.spinner}></span>
            <p>Carregando publicações...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.empty_state}>
            <span className={styles.empty_icon}>!</span>
            <h3>Não foi possível carregar as publicações</h3>
            <p>Tente novamente em alguns instantes.</p>
          </div>
        )}

        {!loading && !error && publishedPosts.length > 0 && (
          <>
            <div className={styles.results_info}>
              <span>
                {publishedPosts.length}{" "}
                {publishedPosts.length === 1
                  ? "publicação encontrada"
                  : "publicações encontradas"}
              </span>
              <span>Mais recentes primeiro</span>
            </div>

            <div className={styles.posts_grid}>
              {publishedPosts.map((post) => (
                <PostDetail key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {!loading && !error && publishedPosts.length === 0 && (
          <div className={styles.empty_state}>
            <span className={styles.empty_icon}>✦</span>
            <h3>O começo de algo interessante</h3>
            <p>
              Ainda não existem publicações por aqui. Que tal compartilhar a
              primeira ideia com a comunidade?
            </p>

            <Link to="/post/create" className={styles.primary_button}>
              Criar primeira publicação
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>

      <section className={styles.community_banner}>
        <div>
          <span className={styles.section_eyebrow}>FAÇA PARTE</span>
          <h2>Sua próxima ideia pode inspirar alguém.</h2>
          <p>
            Compartilhe experiências, conhecimentos e pensamentos. Toda
            publicação tem algo a acrescentar.
          </p>
        </div>

        <Link to="/post/create" className={styles.banner_button}>
          Começar a escrever
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
};

export default Home;
