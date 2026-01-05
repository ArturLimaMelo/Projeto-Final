import styles from "./Landing.module.css";
import CircularProgress from '@mui/joy/CircularProgress';


export default function Landing() {
  return (
    <>
      <h1 className={styles.title}>O Futuro do seu negócio</h1>
      <p className={styles.subtitle}>
        Impulsione suas vendas e expanda seu alcance.
      </p>
      <button className={styles.start}>
        Comece Agora
        <CircularProgress
          color="primary"
          determinate={false}
          size="sm"
          variant="plain"
        />
      </button>
    </>
  );
}
