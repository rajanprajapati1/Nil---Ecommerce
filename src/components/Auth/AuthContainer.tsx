"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./Auth.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RegisterFormDetailed from "./RegisterFormDetailed";

export default function AuthContainer() {
  const [view, setView] = useState<"both" | "register">("both");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const showRegister = () => {
    const tl = gsap.timeline();
    tl.to(contentRef.current, { opacity: 0, y: 10, duration: 0.3, ease: "power2.in" })
      .call(() => setView("register"))
      .fromTo(contentRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  };

  const showBoth = () => {
    const tl = gsap.timeline();
    tl.to(contentRef.current, { opacity: 0, y: 10, duration: 0.3, ease: "power2.in" })
      .call(() => setView("both"))
      .fromTo(contentRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.backBtnWrapper}>
        <button className={styles.backBtn} onClick={view === "register" ? showBoth : undefined}>
          {view === "register" ? "← BACK" : ""}
        </button>
      </div>

      <div ref={contentRef} style={{ width: '100%' }}>
        {view === "both" ? (
          <div className={styles.formsWrapper}>
            <div className={styles.column}>
              <RegisterForm onSwitch={showRegister} />
            </div>

            <div className={styles.column}>
              <LoginForm />
            </div>
          </div>
        ) : (
          <div className={styles.fullFormWrapper}>
            <RegisterFormDetailed onBack={showBoth} />
          </div>
        )}
      </div>
    </div>
  );
}
