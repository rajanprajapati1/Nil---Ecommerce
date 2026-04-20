"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Auth.module.css";

interface RegisterFormProps {
  onSwitch?: () => void;
}

export default function RegisterForm({ onSwitch }: RegisterFormProps) {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.formContainer} ref={formRef}>
      <h1 className={`${styles.title} anim`}>Register</h1>
      
      <p className={`${styles.infoText} anim`}>
        If you still don't have a <strong>nil.com</strong> account, use this option to access the registration form.
      </p>
      
      <p className={`${styles.infoText} anim`}>
        By giving us your details, purchasing in <strong>nil.com</strong> will be faster and an enjoyable experience.
      </p>
      
      <div style={{ marginTop: '3rem' }}>
        <button className={styles.submitBtn} onClick={onSwitch}>
          Create Account
        </button>
      </div>
    </div>
  );
}
