import styles from "./Login.module.css";
import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Form } from "@base-ui/react/form";
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import { useContext, useState } from "react";
import { SessionContext } from "../../context/SessionContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Login() {
  const { session, handleSignIn, sessionMessage, sessionError } = useContext(SessionContext);

  const [ showPassword, setShowPassword ] = useState(false);

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    username: ""
  });

  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!formValues.email) newErrors.email = "Email is required";
    if (!formValues.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    
    handleSignIn(formValues.email, formValues.password);
    
    setFormValues({
      email: "",
      password: "",
    });
    setErrors({});
    setShowPassword(false);
    console.log("handle submit sign in");
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  return (
    <div className={styles.container}>

      <Form onSubmit={handleSubmit}>

      <Fieldset.Root className={styles.Fieldset}>
      <Fieldset.Legend className={styles.Legend}>Login</Fieldset.Legend>
      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Email</Field.Label>
        <Field.Control name="email"placeholder="Seu email" className={styles.Input} onChange={handleInputChange} />
        {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
      </Field.Root>

      <Field.Root className={styles.Field}>
        <Field.Label className={styles.Label}>Senha</Field.Label>
        <Field.Control name="password"type={showPassword ? "text" : "password"} placeholder="Sua senha" className={styles.Input} onChange={handleInputChange} />
        <button
              type="button"
              className={styles.PasswordToggle}
              onClick={handleTogglePassword}
              aria-label={showPassword}
              aria-controls="password"
        >{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
        {errors.password && <span style={{color: 'red'}}>{errors.password}</span>}
      </Field.Root>
    </Fieldset.Root>

    <p>Ainda não tem uma conta? <Link to="/signin" className={styles.link}> Crie uma! </Link></p>
    <Button type="submit" className={styles.Button}>
        Submit
      </Button>
    {sessionMessage && <p style={{color: 'green'}}>{sessionMessage}</p>}
    {sessionError && <p style={{color: 'red'}}>{sessionError}</p>}
    </Form>
    </div>
  );
}
