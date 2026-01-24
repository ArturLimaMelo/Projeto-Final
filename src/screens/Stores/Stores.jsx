import styles from "./Stores.module.css";

import { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../context/SessionContext";
import { Link } from "react-router";
import { supabase } from "../../utils/supabase";
import ProductList from "../../components/ProductList.jsx";
import CircularProgress from "@mui/joy/CircularProgress";
import { Plus } from "lucide-react";

export default function Stores() {
  const { session } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
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

  async function fetchProducts(storeId) {
    const { data, error } = await supabase
      .from("produto")
      .select("*")
      .eq("sold_by", storeId);
    if (data.length === 0) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      setLoadingProducts(false);
      return;
    }

    setProducts(data);
    setLoadingProducts(false);
  }

  useEffect(() => {
    fetchUserNstoreData();
    console.log("UserData", userData);
    console.log("StoreData", storeData);
  }, [session]);

  useEffect(() => {
    if (storeData?.store_id) {
      fetchProducts(storeData.store_id);
    }
  }, [storeData]);

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

      <main className={styles.main}>
        <h2>Produtos</h2>
        
        {loadingProducts ? (
          <CircularProgress
            color="primary"
            determinate={false}
            size="sm"
            variant="plain"
          />
        ) : session.user.id === storeData.store_owner_id ? (
          <div className={styles.products}>
            <ProductList products={products} mode={true} />
          </div>
        ) : (
          <div className={styles.products}>
            <ProductList products={products} />
          </div>
        )}
      </main>
      <div className={styles.addProduct}>
        <h1>Adicionar produto</h1>
        <Link to="/addproduto" className={styles.link}>
          <button className={styles.button}>
            <Plus />
          </button>
        </Link>
      </div>
    </div>
  );
}
