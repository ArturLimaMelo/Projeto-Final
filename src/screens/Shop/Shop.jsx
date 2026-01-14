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
  });

  async function fetchProducts() {
    const { data, error } = await supabase.from("produto").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  }

  return (
    <>
      <ProductList products={products}></ProductList>
    </>
  );
}
