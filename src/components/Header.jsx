import styles from "./Header.module.css";
import { UserRound, LogOut, LogIn, Store, ShoppingBasket } from "lucide-react";
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
        <ThemeToggle className={styles.icon} />
        {!session ? (
          <>
            <Link to="/login" className={styles.link}>
              <UserRound className={styles.icon} />
            </Link>
            <Link to="/signup" className={styles.link}>
              <LogIn />
            </Link>
          </>
        ) : (
          <>
            <Link to="/user" className={styles.link}>
              <UserRound className={styles.icon} />
            </Link>
            <button onClick={handleSignOut} className={styles.button}>
              <LogOut className={styles.icon} />
            </button>
          </>
        )}
        <Link to="/shop" className={styles.link}>
          <Store className={styles.icon} />
        </Link>
        <Link to="/cart" className={styles.link}>
          <ShoppingBasket className={styles.icon} />
        </Link>
      </div>
    </header>
    // Seria legal colocar alguma coisa para simbolizar se está dentro de uma sessão ou não, equipe do frontend é com vocês
    // Talvez mudar a cor do ícone do usuário ou algo do tipo?? nao entendi direito amigo, mais detalhes por favor abraaaaaço :D
  );
}