import styles from "./User.module.css";
import { SessionContext } from "../../context/SessionContext";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { Link } from "react-router";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Button } from "@base-ui/react/button";

export default function User() {
  const { session } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [buildStore, setBuildStore] = useState(false);

  async function fetchUserData() {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário:", error);
    } else {
      setUserData(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchUserData();
    console.log("Build Store:", buildStore);
  }, [session]);

  if (loading) return <p>Loading user data...</p>;

  async function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.userPanel}>
          <div className={styles.actions}>
            <h1 className={styles.greetings}>Meu perfil</h1>
            <p className={styles.greetings}>
              <strong>Bem vindo, {userData.name}!</strong>
            </p>
            <div className={styles.userInfo}>
              <p>Email: {userData.email}</p>
              <p>UID: {userData.id}</p>
              <p>Loja? {userData.store ? "Sim" : "Não"}</p>
            </div>
          </div>
          <div className={styles.actions}>
            <Link to="/cart" className={styles.link}>
              <div className={styles.cart}>
                <h1>Carrinho</h1>
              </div>
            </Link>
            <div className={styles.orders}>
              <Link className={styles.link} to="/orders">
                <h1>Meus Pedidos</h1>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.storeSide}>
          <div
            className={styles.storePanel}
            style={{ height: !buildStore ? "25rem" : "fit-content" }}
          >
            <h1>Loja</h1>
            {!buildStore ? (
              <>
                <button
                  className={styles.start}
                  onClick={() => setBuildStore(true)}
                >
                  Começar?
                </button>
              </>
            ) : (
              <>
                <Form
                  className={styles.Form}
                  errors={errors}
                  onSubmit={handleSubmit}
                >
                  <Field.Root name="title" className={styles.Field}>
                    <Field.Label className={styles.Label}>
                      Nome da loja
                    </Field.Label>
                    <Field.Control
                      type="text"
                      required
                      placeholder="Minha loja 123"
                      className={styles.Input}
                    />
                    <Field.Error className={styles.Error} />
                  </Field.Root>

                  <Field.Root name="description" className={styles.Field}>
                    <Field.Label className={styles.Label}>
                      Descrição da loja
                    </Field.Label>
                    <Field.Control
                      type="text"
                      required
                      placeholder="Compre produtos incríveis!"
                      className={styles.Input}
                    />
                    <Field.Error className={styles.Error} />
                  </Field.Root>
                  <Field.Root name="thumbnail" className={styles.Field}>
                    <Field.Label className={styles.Label}>
                      Imagem da loja
                    </Field.Label>
                    <Field.Control
                      type="url"
                      required
                      placeholder="https://minhaloja.com/imagem.png"
                      className={styles.Input}
                    />
                    <Field.Error className={styles.Error} />
                  </Field.Root>

                  <Button
                    type="submit"
                    disabled={loading}
                    focusableWhenDisabled
                    className={styles.Button}
                  >
                    Submit
                  </Button>

                  <Button
                    className={styles.Button}
                    onClick={() => {
                      setBuildStore(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
