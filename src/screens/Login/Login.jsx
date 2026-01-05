import styles from "./Login.module.css";
import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";

export default function Login() {
  return (
    <div className={styles.container}>

      <Fieldset.Root className={styles.Fieldset}>
      <Fieldset.Legend className={styles.Legend}>Login</Fieldset.Legend>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Usuário</Field.Label>
        <Field.Control placeholder="Seu nome de usuário" className={styles.Input} />
      </Field.Root>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Senha</Field.Label>
        <Field.Control type="password" placeholder="Sua senha" className={styles.Input} />
      </Field.Root>
    </Fieldset.Root>

    <p>Ainda não tem uma conta? <Link to="/signin" className={styles.link}> Crie uma! </Link></p>
    <Button type="submit" className={styles.Button}>
        Submit
      </Button>

    </div>
  );
}
