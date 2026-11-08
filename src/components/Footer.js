import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} MiniBlog. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
