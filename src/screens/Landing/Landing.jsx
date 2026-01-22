// Importa o CSS Module específico dessa página
import styles from "./Landing.module.css";

// Importa um loader circular do MUI (não está sendo usado ainda)
import CircularProgress from "@mui/joy/CircularProgress";

// Importa o componente oficial do Spline para React
import Spline from "@splinetool/react-spline";

// Componente principal da Landing Page
export default function Landing() {
  return (
    // Section que envolve o Spline
    // Serve como "janela de recorte" (viewport do 3D)
    <section className={styles.splineWrapper}>

      {/* 
        Componente do Spline
        Ele renderiza internamente:
        <div>
          <canvas />
        </div>
      */}
      <Spline scene="https://prod.spline.design/nhe4VadwsE4vtqiX/scene.splinecode" />

    </section>
  );
}
