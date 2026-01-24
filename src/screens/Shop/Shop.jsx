import styles from "./Shop.module.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../context/SessionContext";
import ProductList from "../../components/ProductList.jsx";
import { supabase } from "../../utils/supabase.js";

export default function Shop() {
  const { session } = useContext(SessionContext);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from("produto").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  }

  return (
    <div className={styles.shopContainer}>
      <div className={styles.shopWrapper}>
        <div className={styles.shopHeader}>
          <h1 className={styles.shopTitle}>Loja</h1>
          <p className={styles.shopDescription}>
            Explore nossos produtos disponíveis
          </p>
        </div>
        <ProductList products={products}></ProductList>
      </div>
    </div>
  );
}
