import styles from "./Login.module.css";

import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = {
      email: email.trim(),
      password,
    };

    await login(user);
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <main className={styles.login}>
      <header className={styles.page_header}>
        <span className={styles.eyebrow}>MINIBLOG</span>

        <h1>Bem-vindo de volta!</h1>

        <p>
          Entre na sua conta para acessar suas publicações e compartilhar suas
          ideias.
        </p>
      </header>

      <section className={styles.login_card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Endereço de e-mail</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className={styles.error_message} role="alert">
              {error}
            </div>
          )}

          <button
            className={styles.submit_button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar na conta"}
          </button>
        </form>
      </section>

      <div className={styles.auth_prompt}>
        <span>Não possui uma conta?</span>

        <Link to="/register" className={styles.auth_button}>
          Criar conta
        </Link>
      </div>
    </main>
  );
};

export default Login;
