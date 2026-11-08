import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

import styles from "./Dashboard.module.css";

const formatDate = (date) => {
  if (!date) return null;

  const parsedDate =
    typeof date.toDate === "function" ? date.toDate() : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const Dashboard = () => {
  const [view, setView] = useState("grid");

  const { user } = useAuthValue();
  const uid = user?.uid;

  const { documents: posts, loading } = useFetchDocuments("posts", null, uid);

  const { deleteDocument, response: deleteResponse } =
    useDeleteDocument("posts");

  const postList = (posts ?? []).filter(
    (post) => !post.status || post.status === "published",
  );

  const handleDelete = (post) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${post.title}"?`,
    );

    if (confirmed) {
      deleteDocument(post.id);
    }
  };

  if (loading) {
    return (
      <main className={styles.dashboard}>
        <div className={styles.loading_state}>
          <span className={styles.loading_spinner}></span>
          <p>Carregando suas publicações...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.dashboard}>
      <header className={styles.page_header}>
        <div className={styles.header_content}>
          <span className={styles.eyebrow}>ÁREA DO AUTOR</span>

          <h1>Seu dashboard</h1>

          <p>
            Acompanhe suas publicações, organize seus conteúdos e gerencie tudo
            o que você compartilha no MiniBlog.
          </p>
        </div>

        <Link to="/post/create" className={styles.create_button}>
          <span>+</span>
          Nova publicação
        </Link>
      </header>

      <section className={styles.stats_grid}>
        <article className={styles.stat_card}>
          <span className={styles.stat_label}>Publicações publicadas</span>
          <strong className={styles.stat_value}>{postList.length}</strong>
          <span className={styles.stat_description}>
            Conteúdos disponíveis para os leitores
          </span>
        </article>
      </section>

      <section className={styles.management_section}>
        <div className={styles.section_heading}>
          <div>
            <h2>Suas publicações</h2>
            <p>Visualize e gerencie os conteúdos associados à sua conta.</p>
          </div>
        </div>

        {postList.length > 0 && (
          <div className={styles.toolbar}>
            <div
              className={styles.view_group}
              aria-label="Modo de visualização"
            >
              <button
                type="button"
                className={`${styles.view_button} ${
                  view === "grid" ? styles.view_active : ""
                }`}
                onClick={() => setView("grid")}
                aria-label="Visualizar em grade"
                aria-pressed={view === "grid"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" />
                  <rect x="13" y="3" width="8" height="8" rx="1.5" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" />
                  <rect x="13" y="13" width="8" height="8" rx="1.5" />
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.view_button} ${
                  view === "list" ? styles.view_active : ""
                }`}
                onClick={() => setView("list")}
                aria-label="Visualizar em lista"
                aria-pressed={view === "list"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5h13M8 12h13M8 19h13" />
                  <circle cx="3.5" cy="5" r="1" />
                  <circle cx="3.5" cy="12" r="1" />
                  <circle cx="3.5" cy="19" r="1" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {deleteResponse.error && (
          <div className={styles.error_message} role="alert">
            Não foi possível excluir a publicação: {deleteResponse.error}
          </div>
        )}

        {postList.length === 0 ? (
          <div className={styles.empty_state}>
            <div className={styles.empty_icon}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5z" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </div>

            <h3>Seu espaço ainda está vazio</h3>

            <p>
              Você ainda não criou nenhuma publicação. Comece compartilhando uma
              ideia, uma experiência ou algo que gostaria de ensinar.
            </p>

            <Link to="/post/create" className={styles.create_button}>
              Criar primeira publicação
            </Link>
          </div>
        ) : (
          <div
            className={`${styles.posts_grid} ${
              view === "list" ? styles.posts_list : ""
            }`}
          >
            {postList.map((post) => {
              const postDate = formatDate(post.createdAt);
              const tags = Array.isArray(post.tags) ? post.tags : [];

              return (
                <article key={post.id} className={styles.post_card}>
                  <div className={styles.post_image_wrapper}>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={`Imagem de capa: ${post.title}`}
                      />
                    ) : (
                      <div className={styles.image_placeholder}>MiniBlog</div>
                    )}
                  </div>

                  <div className={styles.post_content}>
                    <div className={styles.post_meta}>
                      <span
                        className={`${styles.status_badge} ${styles.status_published}`}
                      >
                        Publicado
                      </span>

                      {postDate && (
                        <span className={styles.post_date}>{postDate}</span>
                      )}
                    </div>

                    <h3 className={styles.post_title}>{post.title}</h3>

                    <p className={styles.post_excerpt}>
                      {post.body
                        ? `${post.body.trim().slice(0, 150)}${
                            post.body.trim().length > 150 ? "..." : ""
                          }`
                        : "Esta publicação ainda não possui uma descrição."}
                    </p>

                    {tags.length > 0 && (
                      <div className={styles.tag_list}>
                        {tags.slice(0, 3).map((tag, index) => (
                          <span key={`${tag}-${index}`}>#{tag}</span>
                        ))}

                        {tags.length > 3 && <span>+{tags.length - 3}</span>}
                      </div>
                    )}

                    <div className={styles.post_actions}>
                      <Link
                        to={`/posts/${post.id}`}
                        className={styles.view_post_button}
                      >
                        Ver publicação
                      </Link>

                      <Link
                        to={`/post/edit/${post.id}`}
                        className={styles.edit_button}
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className={styles.delete_button}
                        onClick={() => handleDelete(post)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
