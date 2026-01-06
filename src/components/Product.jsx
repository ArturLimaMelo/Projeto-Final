import styles from "./Product.module.css";
import { ShoppingCart } from "lucide-react";

export default function Product({ product }) {

  return (
    <>
      <div className={styles.card}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.productImage}
        />

        <h2 className={styles.productTitle}>{product.title}</h2>
        <p className={styles.productDescription}>{product.description}</p>

        <p className={styles.productPrice}>${product.price}</p>
        <button className={styles.productBuy}>
          Adicionar ao Carrinho
          <ShoppingCart />
        </button>
      </div>
    </>
  );
}
