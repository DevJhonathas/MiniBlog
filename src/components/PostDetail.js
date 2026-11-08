import styles from "./PostDetail.module.css";
import { Link } from "react-router-dom";

const PostDetail = ({ post }) => {
  const description = post.body
    ? new DOMParser().parseFromString(post.body, "text/html").body.textContent
    : "";

  return (
    <article className={styles.post_detail}>
      <Link
        to={`/posts/${post.id}`}
        className={styles.imageLink}
        aria-label={`Visualizar publicação: ${post.title}`}
      >
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className={styles.post_image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>Sem imagem</span>
          </div>
        )}
      </Link>

      <div className={styles.content}>
        <span className={styles.post_label}>PUBLICAÇÃO</span>

        <Link to={`/posts/${post.id}`} className={styles.titleLink}>
          <h2>{post.title}</h2>
        </Link>

        {description && <p className={styles.description}>{description}</p>}

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <Link to={`/posts/${post.id}`} className={styles.readButton}>
            Ler publicação
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
