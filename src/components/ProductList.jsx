import styles from "./ProductList.module.css";
import Product from "./Product.jsx";

export default function ProductList({ products }) {

    return (
        <>
        <div className={styles.table}>
            {
                products.map((product) => (
                    <Product product={product} />
                ))
            }
        </div>
        </>
    );
}
