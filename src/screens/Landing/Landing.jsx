import styles from "./Landing.module.css";
import CircularProgress from "@mui/joy/CircularProgress";
import Spline from "@splinetool/react-spline";

import { useState, useEffect } from "react";

export default function Landing() {

  const [width, setWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => {
    setWidth(window.innerWidth);
  }

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  if (width > 1100) {
    return (
    <section className={styles.splineWrapper}>
      <Spline scene="https://prod.spline.design/nhe4VadwsE4vtqiX/scene.splinecode" />
    </section>
    );
  } else {
    return (
    <section className={styles.splineWrapper}>
      <Spline scene="https://prod.spline.design/elWf1AsCsebxRdiB/scene.splinecode" />
    </section>
    );
  }
}
