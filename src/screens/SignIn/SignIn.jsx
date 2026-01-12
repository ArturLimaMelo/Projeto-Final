import styles from "./SignIn.module.css";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import { Form } from "@base-ui/react/form";
import { Button } from "@base-ui/react/button";
import Checkbox from "@mui/joy/Checkbox";
import { Link } from "react-router";
import { toast, Bounce } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { SessionContext } from "../../context/SessionContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function SignIn() {
  const { session, handleSignUp, sessionMessage, sessionError } =
    useContext(SessionContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const [errors, setErrors] = useState({});

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    name: "",
  });

  useEffect(() => {
    if (sessionMessage) {
      toast.success(sessionMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        progress: undefined,
        style: { fontSize: "1.5rem" },
        theme: localStorage.getItem("theme"),
        transition: Bounce,
      });
    } else {
      toast.error(sessionError, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        progress: undefined,
        style: { fontSize: "1.5rem" },
        theme: localStorage.getItem("theme"),
        transition: Bounce,
      });
    }
  }, [sessionMessage, sessionError]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    const newErrors = {};
    if (!formValues.name) newErrors.name = "Nome completo is required";
    
    if (!formValues.username) newErrors.username = "Username is required";
    
    if (!formValues.email) newErrors.email = "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formValues.email && !emailRegex.test(formValues.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formValues.password) newErrors.password = "Password is required";
    
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
      console.log("Senha: ", formValues.password, " - Confirmação: ", formValues.confirmPassword);
    }

    if (formValues.password != formValues.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      console.log("Senhas não coincidem");
    }
    console.log(formValues.password, formValues.password.type, formValues.confirmPassword, formValues.confirmPassword.type);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    handleSignUp(formValues.email, formValues.password, formValues.username);
    navigate("/login");

    
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    const newFormValues = { ...formValues, [name]: value };
    setFormValues(newFormValues);

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    if (newFormValues.password && newFormValues.confirmPassword && newFormValues.password !== newFormValues.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Senhas não coincidem",
      }));
    } else if (newFormValues.password === newFormValues.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: undefined,
      }));
    }
  }

  return (
    <div className={styles.container}>
      <Form onSubmit={handleSubmit} errors={errors}>
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
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Seu nome"
              className={styles.Input}
            />
            <Field.Error className={styles.Error} />
          </Field.Root>

          <Field.Root name="username" className={styles.Field}>
            <Field.Label className={styles.Label}>Nome de usuário</Field.Label>
            <Field.Control
              type="username"
              name="username"
              required
              value={formValues.username}
              onChange={handleInputChange}
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
              value={formValues.email}
              placeholder="sounmx@exemplo.com"
              className={styles.Input}
              onChange={handleInputChange}
            />
            <Field.Error className={styles.Error} />
          </Field.Root>

          <Field.Root name="password" className={styles.Field}>
            <Field.Label className={styles.Label}>Senha</Field.Label>
            <Field.Control
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formValues.password}
              onChange={handleInputChange}
              placeholder="amoempreender123"
              className={styles.Input}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={handleTogglePassword}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-controls="password"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            <Field.Error className={styles.Error} />
          </Field.Root>

          <Field.Root name="confirmPassword" className={styles.Field}>
            <Field.Label className={styles.Label}>
              Confirme sua senha
            </Field.Label>
            <Field.Control
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              placeholder="amoempreender123"
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
  );
}
