import styles from "./User.module.css";
import { SessionContext } from "../../context/SessionContext";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { Link } from "react-router";

export default function User() {
  const { session } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserData() {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário:", error);
    } else {
      setUserData(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchUserData();
  }, [session]);

  if (loading) return <p>Loading user data...</p>;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.userPanel}>
          <div className={styles.actions}>
            <h1 className={styles.greetings}>Meu perfil</h1>
            <p className={styles.greetings}>
              <strong>Bem vindo, {userData.name}!</strong>
            </p>
            <div className={styles.userInfo}>
              <p>Email: {userData.email}</p>
              <p>UID: {userData.id}</p>
              <p>Loja? {userData.store ? "Sim" : "Não"}</p>
            </div>
          </div>
          <div className={styles.actions}>
            <Link to="/cart" className={styles.link}>
              <div className={styles.cart}>
                <h1>Carrinho</h1>
              </div>
            </Link>
            <div className={styles.orders}>
              <Link className={styles.link} to="/orders">
                <h1>Meus Pedidos</h1>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.storeSide}>
          <div className={styles.storePanel}>
            <h1>Loja</h1>
            <Link to="/createStore" className={styles.link}>
              <button className={styles.start}>Começar?</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
