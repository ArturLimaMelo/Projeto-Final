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
  const [userStoreData, setUserStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [buildStore, setBuildStore] = useState(false);

  async function fetchUserData() {
    if (!session?.user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário:", error);
      setLoading(false);
      return;
    }

    setUserData(data);

    if (data.store === true) {
      const { data, error } = await supabase
        .from("loja")
        .select("*")
        .eq("store_owner_id", session.user.id)

      if (error) {
        console.error("Erro ao buscar loja:", error);
        setLoading(false);
        return;
      }

      setUserStoreData(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchUserData();
  }, [session]);

  if (loading) return <p>Loading user data...</p>;

  async function handleSubmit(e) {
    e.preventDefault();

    if (userData.store) {
      setErrors({ form: "Você já possui uma loja." });
      return;
    }

    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title");
    const description = formData.get("description");
    const thumbnail = formData.get("thumbnail");
    const pix_key = formData.get("pix_key");
    const contact = formData.get("contact");

    if (!title || !description || !pix_key || !thumbnail || !contact) {
      setErrors({ form: "Todos os campos são obrigatórios." });
      setLoading(false);
      return;
    }

    const newStore = {
      store_owner_id: session.user.id,
      store_title: title,
      store_description: description,
      store_thumbnail: thumbnail,
      pix_key: pix_key,
      contact: contact
    };

    const { data: storeData, error: storeError } = await supabase
      .from("loja")
      .insert([newStore])
      .select()
      .single();

    if (storeError) {
      console.error("Erro ao criar loja:", storeError);
      setErrors({ form: "Erro ao criar loja." });
      setLoading(false);
      return;
    }

    const { error: userError } = await supabase
      .from("usuario")
      .update({ store: true })
      .eq("id", session.user.id);

    if (userError) {
      console.error("Erro ao atualizar usuário:", userError);
      setErrors({ form: "Erro ao atualizar usuário." });
      setLoading(false);
      return;
    }

    setUserData((prev) => ({
      ...prev,
      store: true,
    }));

    setBuildStore(false);

    setLoading(false);
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
            {buildStore === false && userData.store === false ? (
              <>
                <button
                  className={styles.start}
                  onClick={() => setBuildStore(true)}
                >
                  Começar?
                </button>
              </>
            ) : buildStore === true && userData.store === false ? (
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
                  <Field.Root name="pix_key" className={styles.Field}>
                    <Field.Label className={styles.Label}>
                      Chave PIX
                    </Field.Label>
                    <Field.Control
                      type="text"
                      required
                      placeholder="123.456.789-00"
                      className={styles.Input}
                    />
                    <Field.Error className={styles.Error} />
                  </Field.Root>
                  <Field.Root name="contact" className={styles.Field}>
                    <Field.Label className={styles.Label}>
                      Contato
                    </Field.Label>
                    <Field.Control
                      type="tel"
                      required
                      placeholder="(84) 9 1234-5678"
                      className={styles.Input}
                    />
                    <Field.Error className={styles.Error} />
                  </Field.Root>
                  <Field.Root name="thumbnail" className={styles.Field}>
                    <Field.Label className={styles.Label}>
                      Imagem da loja (url)
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
            ) : buildStore === false && userData.store === true ? (
              <>
                  <Link to="/store" className={styles.store_info_container}>
                    <h2>{userStoreData.store_title}</h2>
                    <p>{userStoreData.store_description}</p>
                    <img
                      className={styles.store_img}
                      src={userStoreData.store_thumbnail}
                      alt="imagem da loja"
                    />
                  </Link>
                </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
