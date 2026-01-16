import styles from "./Product.module.css";
import { ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { SessionContext } from "../context/SessionContext";

export default function Product({ product }) {
  const { addToCart } = useContext(CartContext);
  const { session } = useContext(SessionContext);
  
  return (
    <>
      <div className={styles.card}>
        <img
          src={product.product_thumbnail}
          alt={product.product_title}
          className={styles.productImage}
        />

        <h2 className={styles.productTitle}>{product.product_title}</h2>
        <p className={styles.productDescription}>{product.product_description}</p>

        <p className={styles.productPrice}>${product.price}</p>

        <p className={styles.stock}>Estoque: {product.stock}</p>

        <button onClick={() => {addToCart(product)}} className={styles.productBuy}>
          Adicionar ao Carrinho
          <ShoppingCart />
        </button>
        </div>
    </>
  );
}
