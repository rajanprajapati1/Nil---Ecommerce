"use client";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.nav}>
        <a href="#">TIKTOK</a>
        <a href="#">INSTAGRAM</a>
        <a href="#">FACEBOOK</a>
        <a href="#">TWITTER</a>
        <a href="#">PINTEREST</a>
        <a href="#">YOUTUBE</a>
      </div>
      <div className={styles.bottom}>
        <span>© IIL 2026. THE VOID OF STYLE.</span>
      </div>
    </footer>
  );
}
