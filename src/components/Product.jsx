import styles from "./Product.module.css";
import { ShoppingCart, SquarePen } from "lucide-react";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Button } from "@base-ui/react/button";

export default function Product({ product, mode }) {
  const { addToCart } = useContext(CartContext);

  const [editing, setEditing] = useState(false);

  if (mode && editing) {
    return (
      <>
        <div className={styles.card} style={{ height: "fit-content" }}>
          <Form className={styles.Form}>
            <img
              src={product.product_thumbnail}
              className={styles.productImage}
              alt={product.product_title}
            />
            <Field.Root name="thumbnail" className={styles.Field}>
              <Field.Label className={styles.Label}>
                Foto do produto
              </Field.Label>
              <Field.Control
                type="text"
                required
                placeholder="url da imagem"
                defaultValue={product.product_thumbnail}
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>

            <Field.Root name="title" className={styles.Field}>
              <Field.Label className={styles.Label}>Título</Field.Label>
              <Field.Control
                type="text"
                required
                placeholder="Minha loja 123"
                defaultValue={product.product_title}
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>

            <Field.Root name="description" className={styles.Field}>
              <Field.Label className={styles.Label}>Descrição</Field.Label>
              <Field.Control
                type="text"
                required
                placeholder="Compre produtos incríveis!"
                defaultValue={product.product_description}
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>
            <Field.Root name="price" className={styles.Field}>
              <Field.Label className={styles.Label}>Preço</Field.Label>
              <Field.Control
                type="number"
                required
                placeholder="price"
                defaultValue={product.price}
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>

            <div className={styles.buttons}>
              <Button
                type="submit"
                focusableWhenDisabled
                className={styles.Button}
              >
                Submit
              </Button>

              <Button
                className={styles.Button}
                onClick={() => setEditing(false)}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </div>
      </>
    );
  } else if (mode) {
    return (
      <>
        <div className={styles.card}>
          <img
            src={product.product_thumbnail}
            alt={product.product_title}
            className={styles.productImage}
          />

          <h2 className={styles.productTitle}>{product.product_title}</h2>
          <p className={styles.productDescription}>
            {product.product_description}
          </p>

          <p className={styles.productPrice}>${product.price}</p>

          <p className={styles.stock}>Estoque: {product.stock}</p>
          <button className={styles.Button} onClick={() => setEditing(true)}>
            Editar
            <SquarePen />
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.card}>
          <div className={styles.inner}>
            <div className={styles.content}>
              <img
                src={product.product_thumbnail}
                alt={product.product_title}
                className={styles.productImage}
              />

              <h2 className={styles.productTitle}>{product.product_title}</h2>
              <p className={styles.productDescription}>
                {product.product_description}
              </p>

              <p className={styles.productPrice}>${product.price}</p>

              <p className={styles.stock}>Estoque: {product.stock}</p>
            </div>

            <button
              onClick={() => {
                addToCart(product);
              }}
              className={styles.Button}
            >
              Adicionar ao Carrinho
              <ShoppingCart />
            </button>
          </div>
        </div>
      </>
    );
  }
}
