import styles from "./CreateStore.module.css";
import { useState, useEffect } from "react";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import { Form } from "@base-ui/react/form";
import { Button } from "@base-ui/react/button";
import Checkbox from "@mui/joy/Checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function CreateStore() {
  async function handleSubmit(e) {
    e.preventDefault();

    // Lógica para criar a loja
  }

  return (
    <>
      <div className={styles.container}>
        <h1>Crie sua loja</h1>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <Fieldset.Root className={styles.Fieldset}>
            <Fieldset.Legend className={styles.Legend}>
              Cadastrar-se
            </Fieldset.Legend>

            <Field.Root className={styles.Field}>
              <Field.Label className={styles.Label}>Nome completo</Field.Label>
              <Field.Control
                type="name"
                name="name"
                required
                placeholder="Seu nome"
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>

            <Field.Root name="username" className={styles.Field}>
              <Field.Label className={styles.Label}>
                Nome de usuário
              </Field.Label>
              <Field.Control
                type="username"
                name="username"
                required
                placeholder="Empreendedor 123"
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>

            <Field.Root name="email" className={styles.Field}>
              <Field.Label className={styles.Label}>Email</Field.Label>
              <Field.Control
                type="email"
                name="email"
                required
                placeholder="sounmx@exemplo.com"
                className={styles.Input}
              />
              <Field.Error className={styles.Error} />
            </Field.Root>
          </Fieldset.Root>

          <Checkbox
            label="Deseja receber ofertas no seu email?"
            color="neutral"
          />

          <Button type="submit" className={styles.Button}>
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
}
