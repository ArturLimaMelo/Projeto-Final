import styles from "./Product.module.css";
import { ShoppingCart, SquarePen } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { supabase } from "../utils/supabase";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Button } from "@base-ui/react/button";

export default function Product({ product, mode }) {
  const { addToCart } = useContext(CartContext);

  const [editing, setEditing] = useState(false);

  const [localProduct, setLocalProduct] = useState(product);
  const [thumbnail, setThumbnail] = useState(product.product_thumbnail || "");
  const [title, setTitle] = useState(product.product_title || "");
  const [description, setDescription] = useState(product.product_description || "");
  const [price, setPrice] = useState(product.price || 0);
  const [stock, setStock] = useState(product.stock ?? 0);

  useEffect(() => {
    setLocalProduct(product);
    setThumbnail(product.product_thumbnail || "");
    setTitle(product.product_title || "");
    setDescription(product.product_description || "");
    setPrice(product.price || 0);
    setStock(product.stock ?? 0);
  }, [product]);

  async function handleSubmit(e) {
    e.preventDefault();

    const updates = {
      product_thumbnail: thumbnail,
      product_title: title,
      product_description: description,
      price: Number(price),
      stock: Number(stock),
    };

    try {
        const productKey = product.product_id ?? product.id;


        let resp = await supabase.from("produto").update(updates).eq("product_id", productKey).select();
        if (resp.error) {
          console.error("Erro ao atualizar produto (product_id):", resp.error);
          return;
        }

        let updated = (resp.data && resp.data[0]) ?? null;

        if (!updated) {
          const fb = await supabase.from("produto").update(updates).eq("id", productKey).select();
          if (fb.error) {
            console.error("Erro ao atualizar produto (id fallback):", fb.error);
            return;
          }
          updated = (fb.data && fb.data[0]) ?? null;
        }

        if (!updated) {
          console.warn("Atualização retornou 0 linhas para produto:", productKey);
          return;
        }

        setLocalProduct((prev) => ({ ...prev, ...updated }));
        setEditing(false);
    } catch (err) {
      console.error("Erro inesperado ao atualizar produto:", err);
    }
  }

  if (mode && editing) {
    return (
      <>
        <div className={styles.card} style={{ height: "fit-content" }}>
          <Form className={styles.Form} onSubmit={handleSubmit}>
            <img
              src={thumbnail}
              className={styles.productImage}
              alt={title}
            />
            <Field.Root name="thumbnail" className={styles.Field}>
              <Field.Label className={styles.Label}>
                Foto do produto
              </Field.Label>
              <Field.Control
                type="text"
                required
                placeholder="url da imagem"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>
            <Field.Root name="stock" className={styles.Field}>
              <Field.Label className={styles.Label}>Estoque</Field.Label>
              <Field.Control
                type="number"
                required
                placeholder="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
                Salvar
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
            src={localProduct.product_thumbnail}
            alt={localProduct.product_title}
            className={styles.productImage}
          />

          <h2 className={styles.productTitle}>{localProduct.product_title}</h2>
          <p className={styles.productDescription}>
            {localProduct.product_description}
          </p>

          <p className={styles.productPrice}>${localProduct.price}</p>

          <p className={styles.stock}>Estoque: {localProduct.stock}</p>
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
