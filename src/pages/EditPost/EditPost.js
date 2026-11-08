import styles from "./EditPost.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import { useAuthValue } from "../../context/AuthContext";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";

const formatDate = (date) => {
  if (!date) return "Data não disponível";

  const parsedDate =
    typeof date.toDate === "function" ? date.toDate() : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Data não disponível";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthValue();

  const {
    document: post,
    loading: postLoading,
    error: postError,
  } = useFetchDocument("posts", id);

  const { updateDocument, response } = useUpdateDocument("posts");

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bodyText = body
    ? new DOMParser().parseFromString(body, "text/html").body.textContent || ""
    : "";

  const cleanBodyText = bodyText.trim();

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setBody(DOMPurify.sanitize(post.body || ""));
      setImage(post.image || "");
      setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    }
  }, [post]);

  const tagsArray = tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const cleanTitle = title.trim();
    const cleanImage = image.trim();
    const cleanBody = DOMPurify.sanitize(body.trim());

    const cleanBodyText = new DOMParser()
      .parseFromString(cleanBody, "text/html")
      .body.textContent.trim();

    if (!cleanTitle || !cleanImage || !cleanBodyText || !tags.trim()) {
      setFormError("Preencha todos os campos antes de salvar.");
      return;
    }

    let imageUrl;

    try {
      imageUrl = new URL(cleanImage);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        throw new Error("URL inválida");
      }
    } catch {
      setFormError("Insira uma URL de imagem válida.");
      return;
    }

    if (tagsArray.length === 0) {
      setFormError("Adicione pelo menos uma tag.");
      return;
    }

    const data = {
      title: cleanTitle,
      image: imageUrl.href,
      body: cleanBody,
      tags: tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    };

    setIsSubmitting(true);

    try {
      await updateDocument(id, data);
      navigate("/dashboard");
    } catch (error) {
      setFormError(error.message || "Não foi possível atualizar a publicação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (postLoading || (!post && !postError)) {
    return (
      <main className={styles.edit_post}>
        <div className={styles.loading_state}>
          <span className={styles.loading_spinner}></span>
          <p>Carregando publicação...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className={styles.edit_post}>
        <div className={styles.not_found}>
          <h2>Publicação não encontrada</h2>
          <p>
            Não foi possível localizar esta publicação. Ela pode ter sido
            removida ou o endereço pode estar incorreto.
          </p>

          <Link to="/dashboard" className={styles.back_button}>
            Voltar ao dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.edit_post}>
      <header className={styles.page_header}>
        <div className={styles.header_content}>
          <span className={styles.eyebrow}>GERENCIAMENTO DE CONTEÚDO</span>

          <h1>Editar publicação</h1>

          <p>
            Atualize as informações, aprimore seu conteúdo e mantenha suas
            publicações sempre organizadas.
          </p>
        </div>

        <Link to="/dashboard" className={styles.back_button}>
          <span>←</span>
          Voltar ao dashboard
        </Link>
      </header>

      <div className={styles.editor_layout}>
        <section className={styles.editor_card}>
          <div className={styles.card_header}>
            <div>
              <span className={styles.section_eyebrow}>EDITOR</span>
              <h2>Informações da publicação</h2>
              <p>Faça as alterações desejadas no seu conteúdo.</p>
            </div>

            <span className={styles.status_badge}>
              {post.status === "draft" ? "Rascunho" : "Publicado"}
            </span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <div className={styles.field_header}>
                <label htmlFor="title">Título da publicação</label>
                <span>{title.length}/120</span>
              </div>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="Digite um título interessante..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="image">Imagem de capa</label>

              <input
                id="image"
                type="url"
                name="image"
                placeholder="https://exemplo.com/imagem.jpg"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setPreviewError(false);
                }}
                required
              />

              <small>
                Utilize uma imagem que represente bem o assunto da publicação.
              </small>
            </div>

            <div className={styles.field}>
              <div className={styles.field_header}>
                <label>Conteúdo da publicação</label>
                <span>{cleanBodyText.length} caracteres</span>
              </div>

              <RichTextEditor value={body} onChange={setBody} />

              <small>
                Formate seu texto com títulos, cores, listas e outros recursos.
              </small>
            </div>

            <div className={styles.field}>
              <label htmlFor="tags">Tags da publicação</label>

              <input
                id="tags"
                type="text"
                name="tags"
                placeholder="tecnologia, programação, desenvolvimento"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
              />

              <small>
                Separe as tags utilizando vírgulas para facilitar a organização
                do conteúdo.
              </small>

              {tagsArray.length > 0 && (
                <div className={styles.tag_preview}>
                  {tagsArray.map((tag, index) => (
                    <span key={`${tag}-${index}`}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {(formError || response.error) && (
              <div className={styles.error_message} role="alert">
                {formError || response.error}
              </div>
            )}

            <div className={styles.form_footer}>
              <span>Suas alterações serão salvas na publicação existente.</span>

              <button
                type="submit"
                className={styles.save_button}
                disabled={response.loading || isSubmitting}
              >
                {response.loading || isSubmitting
                  ? "Salvando alterações..."
                  : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>

        <aside className={styles.sidebar}>
          <section className={styles.preview_section}>
            <div className={styles.sidebar_heading}>
              <h2>Pré-visualização</h2>
              <span>Ao vivo</span>
            </div>

            <article className={styles.preview_card}>
              <div className={styles.preview_image}>
                {image.trim() && !previewError ? (
                  <img
                    src={image.trim()}
                    alt="Pré-visualização da capa"
                    onError={() => setPreviewError(true)}
                    onLoad={() => setPreviewError(false)}
                  />
                ) : (
                  <div className={styles.preview_placeholder}>
                    <span>MiniBlog</span>
                    <small>
                      {previewError
                        ? "Não foi possível carregar a imagem"
                        : "Sua imagem aparecerá aqui"}
                    </small>
                  </div>
                )}
              </div>

              <div className={styles.preview_content}>
                <span className={styles.preview_status}>
                  {post.status === "draft" ? "Rascunho" : "Publicado"}
                </span>

                <h3>{title.trim() || "Título da sua publicação"}</h3>

                <p>
                  {cleanBodyText
                    ? `${cleanBodyText.slice(0, 130)}${
                        cleanBodyText.length > 130 ? "..." : ""
                      }`
                    : "O conteúdo da sua publicação aparecerá aqui."}
                </p>

                {tagsArray.length > 0 && (
                  <div className={styles.preview_tags}>
                    {tagsArray.slice(0, 3).map((tag, index) => (
                      <span key={`${tag}-${index}`}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className={styles.info_card}>
            <h3>Sobre esta publicação</h3>

            <div className={styles.info_item}>
              <span>Criada por</span>
              <strong>{post.createdBy || user?.displayName || "Autor"}</strong>
            </div>

            <div className={styles.info_item}>
              <span>Data de criação</span>
              <strong>{formatDate(post.createdAt)}</strong>
            </div>

            <div className={styles.info_item}>
              <span>Quantidade de tags</span>
              <strong>{tagsArray.length}</strong>
            </div>
          </section>

          <section className={styles.tip_card}>
            <h3>Dicas para uma boa publicação</h3>

            <ul>
              <li>Escolha um título claro e objetivo.</li>
              <li>Utilize uma imagem relacionada ao assunto.</li>
              <li>Organize o conteúdo em parágrafos.</li>
              <li>Adicione tags relevantes para seu texto.</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default EditPost;
