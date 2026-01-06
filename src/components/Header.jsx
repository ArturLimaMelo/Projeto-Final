import styles from "./Header.module.css";
import { UserRound } from "lucide-react";
import { LogIn } from "lucide-react";
import { Link } from "react-router";

export function Header() {
    return (
        <header className={styles.container}>
            <Link to="/" className={styles.link}> <h1 className={styles.title}>NeoMarketX</h1></Link>
            
            <div className={styles.options}>
            <Link to="/login" className={styles.link}><UserRound  /></Link>
            <Link to="/signin" className={styles.link}><LogIn /></Link>
            <Link to="/shop">Shop</Link>
            </div>
        </header>
    )
}

