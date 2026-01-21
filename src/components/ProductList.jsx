import styles from "./ProductList.module.css";
import Product from "./Product.jsx";

export default function ProductList({ products, mode}) {

    //console.log(products);

    return (
        <>
        <div className={styles.table}>
            {
                products.map((product) => (
                    <Product key={product.id} product={product} mode={mode} />
                ))
            }
        </div>
        </>
    );
}
