import styles from "./Stores.module.css";

import { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../context/SessionContext";
import { supabase } from "../../utils/supabase";

export default function Stores() {
  const { session } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserNstoreData() {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário:", error);
      setLoading(false);
      return;
    }

    setUserData(data);

    const { data: storeResponse, error: storeError } = await supabase
      .from("loja")
      .select("*")
      .eq("store_owner_id", session.user.id)
      .single();

    if (storeError) {
      setLoading(false);
      console.error("Erro ao buscar loja:", storeError);
      return;
    }

    setStoreData(storeResponse);

    setLoading(false);
  }

  useEffect(() => {
    fetchUserNstoreData();
    console.log("UserData", userData);
    console.log("StoreData", storeData);
  }, [session]);

  if (!storeData) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.storeHead}>
        <img
          className={styles.store_img}
          src={storeData.store_thumbnail}
          alt=""
        />
        <div className={styles.text}>
          <h1>{storeData.store_title}</h1>
          <h3>{storeData.store_description}</h3>
        </div>
      </div>
    </div>
  );
}
