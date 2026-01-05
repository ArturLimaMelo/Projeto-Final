import styles from "./SignIn.module.css";
import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Button } from '@base-ui/react/button';
import Checkbox from '@mui/joy/Checkbox';
import { Link } from "react-router";
export default function SignIn() {
  return (
    <div className={styles.container}>

      <Fieldset.Root className={styles.Fieldset}>
      <Fieldset.Legend className={styles.Legend}>Cadastrar-se</Fieldset.Legend>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Nome completo</Field.Label>
        <Field.Control placeholder="Seu nome" className={styles.Input} />
      </Field.Root>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Nome de usuário</Field.Label>
        <Field.Control placeholder="Empreendedor 123" className={styles.Input} />
      </Field.Root>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Email</Field.Label>
        <Field.Control placeholder="sounmx@exemplo.com" className={styles.Input} />
      </Field.Root>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Senha</Field.Label>
        <Field.Control type="password" placeholder="amoempreender123" className={styles.Input} />
      </Field.Root>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Confirme sua senha</Field.Label>
        <Field.Control type="password" placeholder="amoempreender123" className={styles.Input} />
      </Field.Root>
    </Fieldset.Root>

    <Checkbox label="Deseja receber ofertas no seu email?" color="neutral" />

    <Button type="submit" className={styles.Button}>
        Submit
      </Button>

    </div>
  );
}
