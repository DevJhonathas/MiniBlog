import styles from "./About.module.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className={styles.about}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>CONHEÇA O PROJETO</span>

        <h2>
          Sobre o Mini<span>Blog</span>
        </h2>

        <p className={styles.description}>
          O MiniBlog é um projeto desenvolvido para proporcionar um espaço
          simples e intuitivo para criar, compartilhar e explorar publicações. A
          proposta é incentivar a expressão de ideias, experiências e interesses
          por meio de conteúdos compartilhados pela comunidade.
        </p>

        <div className={styles.technologies}>
          <span>React</span>
          <span>Firebase</span>
          <span>JavaScript</span>
        </div>

        <div className={styles.creator}>
          <div className={styles.creatorIcon}>J</div>

          <div className={styles.creatorInfo}>
            <span>Desenvolvido por</span>
            <strong>Jhonathas Souza</strong>
          </div>

          <a
            href="https://github.com/devjhonathas"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="Visitar meu perfil no GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.09.67-3.74-1.31-3.74-1.31-.51-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.92.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.27-2.61 5.21-5.09 5.49.4.35.75 1.02.75 2.06v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
              />
            </svg>
            GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <Link to="/post/create" className={styles.createButton}>
          Criar publicação
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
};

export default About;
