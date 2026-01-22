import styles from "./Landing.module.css";
import CircularProgress from "@mui/joy/CircularProgress";
import Spline from "@splinetool/react-spline";

export default function Landing() {
  return (
    <>   
    <section className={styles.splineWrapper}>
         <Spline scene="https://prod.spline.design/nhe4VadwsE4vtqiX/scene.splinecode" />
    </section>
    </>
  );
}