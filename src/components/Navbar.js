import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../context/AuthContext";

import styles from "./Navbar.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAuthValue();
  const { logout } = useAuthentication();

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `${styles.nav_link} ${isActive ? styles.active : ""}`;

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_inner}>
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          Mini<span>Blog</span>
        </NavLink>

        <button
          type="button"
          className={`${styles.menu_toggle} ${menuOpen ? styles.menu_toggle_open : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="navbar-links"
        >
          <span />
          <span />
          <span />
        </button>

        <ul
          id="navbar-links"
          className={`${styles.link_list} ${menuOpen ? styles.link_list_open : ""}`}
        >
          <li>
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              Início
            </NavLink>
          </li>

          {!user && (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Entrar
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/register"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Cadastrar
                </NavLink>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <NavLink
                  to="/post/create"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Nova publicação
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
              Sobre
            </NavLink>
          </li>

          {user && (
            <li>
              <button
                type="button"
                className={styles.logout_button}
                onClick={handleLogout}
              >
                Sair
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
