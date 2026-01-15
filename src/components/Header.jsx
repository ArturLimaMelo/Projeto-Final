import styles from "./Header.module.css";
import { UserRound, LogOut, LogIn, Store } from "lucide-react";
import { Link } from "react-router";
import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { session, handleSignOut } = useContext(SessionContext);
  return (
    <header className={styles.container}>
      <Link to="/" className={styles.link}>
        {" "}
        <h1 className={styles.title}>NeoMarketX</h1>
      </Link>

      <div className={styles.options}>
        <ThemeToggle/>
        {!session ? (
          <>
            <Link to="/login" className={styles.link}>
              <UserRound />
            </Link>
            <Link to="/signup" className={styles.link}>
              <LogIn />
            </Link>
          </>
        ) : (
          <>
            <Link to="/user" className={styles.link}>
              <UserRound />
            </Link>
            <button onClick={handleSignOut} className={styles.button}>
              <LogOut />
            </button>
          </>
        )}
        <Link to="/shop" className={styles.link}>
          <Store />
        </Link>
      </div>
    </header>
    // Seria legal colocar alguma coisa para simbolizar se está dentro de uma sessão ou não, equipe do frontend é com vocês
  );
}