import styles from "./Cart.module.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../context/SessionContext";
import { CartContext } from "../../context/CartContext";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router";

export default function Cart() {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const { uniqueProducts, removeFromCart, addToCart, clearCart } =
    useContext(CartContext);
  const [productDetailsMap, setProductDetailsMap] = useState({});
  useEffect(() => {
    const ids = uniqueProducts
      .map((u) => u.product_id ?? u.id)
      .filter(Boolean);
    if (ids.length === 0) {
      setProductDetailsMap({});
      return;
    }

    let mounted = true;
    async function fetchDetails() {
      try {
        const { data, error } = await supabase
          .from("produto")
          .select("*")
          .in("product_id", ids);
        if (!mounted) return;
        if (error) {
          console.error("Error fetching product details:", error);
          return;
        }
        const map = {};
        (data || []).forEach((d) => {
          const key = d.product_id ?? d.id;
          if (key) map[key] = d;
        });
        setProductDetailsMap(map);
      } catch (err) {
        console.error("fetchDetails exception:", err);
      }
    }

    fetchDetails();
    return () => {
      mounted = false;
    };
  }, [uniqueProducts]);

  const subtotal = uniqueProducts.reduce(
    (acc, p) =>
      acc + ((productDetailsMap[p.product_id ?? p.id]?.price ?? p.price ?? 0) * (p.qty ?? p.quantity ?? 1)),
    0
  );

  return (
    <>
      <div className={styles.container}>
        {!session ? (
          <p>Please log in to view your cart.</p>
        ) : (
            <>
          <div className={styles.productsPanel}>
            <h1>Carrinho de Compras</h1>
            <div className={styles.product}>
              {uniqueProducts.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
              ) : (
                uniqueProducts.map((product) => {
                  const idKey = product.product_id ?? product.id;
                  const details = productDetailsMap[idKey] || {};

                  const display = {
                    id: idKey,
                    product_title:
                      details.product_title ?? product.product_title,
                    product_thumbnail:
                      details.product_thumbnail ?? product.product_thumbnail,
                    price: details.price ?? product.price ?? 0,
                    stock: details.stock,
                    qty: product.qty ?? product.quantity ?? 1,
                  };
                  return (
                    <div key={idKey} className={styles.productItem}>
                      <img src={display.product_thumbnail} alt={display.product_title} />
                      <h3>{display.product_title}</h3>
                      {display.stock > 0 ? <h5 className={styles.inStock}>Em estoque</h5> : <h5 className={styles.outOfStock}>Fora de estoque</h5>}

                      <div className={styles.qtyControls}>
                        <button onClick={() => removeFromCart(product)} disabled={display.qty <= 1}>
                          -
                        </button>
                        <p>{display.qty}</p>
                        <button onClick={() => addToCart(product)}>+</button>
                      </div>

                      <p>${(display.price).toFixed(2)}</p>
                      <button onClick={() => clearCart(product)}>Remove</button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className={styles.summaryPanel}>
              <h1>subtotal: R$ {subtotal.toFixed(2)}</h1>
            <button className={styles.checkoutButton} disabled={uniqueProducts.length === 0} onClick={() => navigate("/checkout")}>Finalizar Compra</button>
          </div>
          </>
        )}
      </div>
    </>
  );
}
