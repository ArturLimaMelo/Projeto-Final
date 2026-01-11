import styles from "./SignIn.module.css";
import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Form } from "@base-ui/react/form";
import { Button } from '@base-ui/react/button';
import Checkbox from '@mui/joy/Checkbox';
import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import { SessionContext } from "../../context/SessionContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";



export default function SignIn() {

  const { session, handleSignUp, sessionMessage, sessionError } = useContext(SessionContext);

  const [ showPassword, setShowPassword ] = useState(false);
  
  const handleTogglePassword = () => setShowPassword((show) => !show);

  const [errors, setErrors] = useState({});

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    name: ""
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(value)
  }

    async function handleSubmit(e) {
      e.preventDefault();

    const newErrors = {};
      if (!formValues.name) newErrors.name = "Nome completo is required";
      if (!formValues.username) newErrors.username = "Username is required";
      if (!formValues.email) newErrors.email = "Email is required";
      if (!formValues.password) newErrors.password = "Password is required";
      if (!formValues.confirmPassword)
        newErrors.confirmPassword = "Confirm Password is required";
      if (formValues.password !== formValues.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      
      console.log("Validation errors:", errors);
      return;
    }
  
  
    handleSignUp(formValues.email, formValues.password, formValues.username);
  }
  return (
    <div className={styles.container}>
      <Form onSubmit={handleSubmit}>
      <Fieldset.Root className={styles.Fieldset}>
      <Fieldset.Legend className={styles.Legend}>Cadastrar-se</Fieldset.Legend>

      <Field.Root className={styles.Field} error={errors.name}>
        <Field.Label className={styles.Label}>Nome completo</Field.Label>
        <Field.Control name="name" placeholder="Seu nome" className={styles.Input} onChange={handleInputChange} value={formValues.name} />
        <Field.Error className={styles.Error}>{errors.name}</Field.Error>
      </Field.Root>

      <Field.Root className={styles.Field} error={errors.username}>
        <Field.Label className={styles.Label}>Nome de usuário</Field.Label>
        <Field.Control name="username" placeholder="Empreendedor 123" className={styles.Input} onChange={handleInputChange} value={formValues.username} />
        <Field.Error className={styles.Error} value={errors.username}/>
      </Field.Root>

      <Field.Root className={styles.Field} error={errors.email}>
        <Field.Label className={styles.Label}>Email</Field.Label> 
        <Field.Control name="email" placeholder="sounmx@exemplo.com" className={styles.Input} onChange={handleInputChange} value={formValues.email} />
        <Field.Error className={styles.Error} value={errors.email}/>
      </Field.Root>

      <Field.Root className={styles.Field} error={errors.password}>
        <Field.Label className={styles.Label}>Senha</Field.Label>

        <Field.Control name="password" type={showPassword ? "text" : "password"} placeholder="amoempreender123" className={styles.Input} onChange={handleInputChange} value={formValues.password} />
        <button
              type="button"
              className={styles.passwordToggle}
              onClick={handleTogglePassword}
              aria-label={showPassword}
              aria-controls="password"
        >{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
        <Field.Error className={styles.Error}>{errors.password}</Field.Error>
      </Field.Root>

      <Field.Root className={styles.Field} error={errors.confirmPassword}>
        <Field.Label className={styles.Label}>Confirme sua senha</Field.Label>
        <Field.Control name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="amoempreender123" className={styles.Input} onChange={handleInputChange} value={formValues.confirmPassword} />
        <Field.Error className={styles.Error}>{errors.confirmPassword}</Field.Error>
      </Field.Root>
    </Fieldset.Root>

    <Checkbox label="Deseja receber ofertas no seu email?" color="neutral" />

    <Button type="submit" className={styles.Button}>
        Submit
      </Button>
    </Form>
    </div>
  );
}
