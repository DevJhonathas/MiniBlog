import styles from "./CreatePost.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("posts");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const cleanTitle = title.trim();
    const cleanImage = image.trim();
    const cleanBody = body.trim();
    const bodyText = new DOMParser()
      .parseFromString(cleanBody, "text/html")
      .body.textContent.trim();

    if (!cleanTitle || !cleanImage || !bodyText || !tags.trim()) {
      setFormError("Preencha todos os campos antes de publicar.");
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

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    if (tagsArray.length === 0) {
      setFormError("Adicione pelo menos uma tag.");
      return;
    }

    insertDocument({
      title: cleanTitle,
      image: imageUrl.href,
      body: cleanBody,
      tags: tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    });

    navigate("/");
  };

  return (
    <main className={styles.create_post}>
      <header className={styles.page_header}>
        <span className={styles.eyebrow}>EDITOR DE CONTEÚDO</span>

        <h1>Criar publicação</h1>

        <p>
          Compartilhe suas ideias, experiências e conhecimentos com a
          comunidade.
        </p>
      </header>

      <section className={styles.editor_card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="title">Título da publicação</label>

            <input
              id="title"
              type="text"
              name="title"
              placeholder="Dê um título interessante ao seu post..."
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
              onChange={(e) => setImage(e.target.value)}
              required
            />

            <small>
              Adicione o endereço de uma imagem que represente sua publicação.
            </small>
          </div>

          <div className={styles.field}>
            <label>Conteúdo da publicação</label>

            <RichTextEditor value={body} onChange={setBody} />

            <small>
              Formate seu texto com títulos, cores, listas e outros recursos.
            </small>
          </div>

          <div className={styles.field}>
            <label htmlFor="tags">Tags</label>

            <input
              id="tags"
              type="text"
              name="tags"
              placeholder="tecnologia, programação, desenvolvimento"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            />

            <small>Separe as tags utilizando vírgulas.</small>
          </div>

          {(formError || response.error) && (
            <div className={styles.error_message} role="alert">
              {formError || response.error}
            </div>
          )}

          <div className={styles.form_footer}>
            <span className={styles.form_hint}>
              Revise sua publicação antes de enviar.
            </span>

            <button
              className={styles.submit_button}
              type="submit"
              disabled={response.loading}
            >
              {response.loading ? "Publicando..." : "Publicar post"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreatePost;
