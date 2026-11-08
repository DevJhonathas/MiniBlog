import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import styles from "./Post.module.css";

import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthValue();

  const [menuOpen, setMenuOpen] = useState(false);

  const { document: post, loading, error } = useFetchDocument("posts", id);
  const { deleteDocument, response } = useDeleteDocument("posts");

  const isOwner = Boolean(user?.uid && post?.uid && user.uid === post.uid);

  const handleDelete = async () => {
    if (!isOwner || response.loading) return;

    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir esta publicação? Essa ação não poderá ser desfeita.",
    );

    if (!confirmed) return;

    setMenuOpen(false);

    const deleted = await deleteDocument(id);

    if (deleted) {
      navigate("/dashboard", { replace: true });
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <span className={styles.spinner}></span>
          <p>Carregando publicação...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <h2>Publicação não encontrada</h2>
          <p>{error || "Não foi possível encontrar esta publicação."}</p>
          <Link to="/" className={styles.backLink}>
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <article className={styles.post}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>M</div>
            <strong>MiniBlog</strong>
          </div>

          {isOwner && (
            <div className={styles.menuContainer}>
              <button
                type="button"
                className={styles.moreButton}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Opções da publicação"
                aria-expanded={menuOpen}
              >
                ⋯
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    className={styles.menuBackdrop}
                    onClick={() => setMenuOpen(false)}
                    aria-label="Fechar menu"
                  />

                  <div className={styles.dropdown}>
                    <Link
                      to={`/post/edit/${id}`}
                      className={styles.editOption}
                      onClick={() => setMenuOpen(false)}
                    >
                      Editar publicação
                    </Link>

                    <button
                      type="button"
                      className={styles.deleteOption}
                      onClick={handleDelete}
                      disabled={response.loading}
                    >
                      {response.loading ? "Excluindo..." : "Excluir publicação"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </header>

        {post.image && (
          <div className={styles.imageContainer}>
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <div className={styles.content}>
          <h1>{post.title}</h1>

          <div
            className={styles.body}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.body || ""),
            }}
          />

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}

          {response.error && (
            <p className={styles.errorMessage}>
              Erro ao excluir publicação: {response.error}
            </p>
          )}
        </div>
      </article>
    </main>
  );
};

export default Post;
