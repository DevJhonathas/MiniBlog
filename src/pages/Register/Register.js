import styles from "./Register.module.css";

import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom";

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { createUser, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanDisplayName = displayName.trim();
    const cleanEmail = email.trim();

    if (!cleanDisplayName || !cleanEmail || !password || !confirmPassword) {
      setError("Preencha todos os campos antes de continuar.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    const user = {
      displayName: cleanDisplayName,
      email: cleanEmail,
      password,
    };

    await createUser(user);
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <main className={styles.register}>
      <header className={styles.page_header}>
        <span className={styles.eyebrow}>MINIBLOG</span>

        <h1>Crie sua conta</h1>

        <p>
          Faça parte da comunidade e comece a compartilhar suas histórias,
          ideias e conhecimentos.
        </p>
      </header>

      <section className={styles.register_card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="displayName">Nome completo</label>

            <input
              id="displayName"
              type="text"
              name="displayName"
              placeholder="Como gostaria de ser chamado?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              maxLength={80}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Endereço de e-mail</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirmação da senha</label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Digite sua senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
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
            {loading ? "Cadastrando..." : "Criar minha conta"}
          </button>
        </form>
      </section>

      <div className={styles.auth_prompt}>
        <span>Já possui uma conta?</span>

        <Link to="/login" className={styles.auth_button}>
          Fazer login
        </Link>
      </div>
    </main>
  );
};

export default Register;
