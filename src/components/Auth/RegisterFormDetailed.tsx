"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Auth.module.css";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";

interface RegisterFormDetailedProps {
  onBack: () => void;
}

export default function RegisterFormDetailed({ onBack }: RegisterFormDetailedProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.user.clear();
    await db.user.put({ email, loggedInAt: Date.now() });
    router.push("/");
  };

  return (
    <div className={styles.fullFormContainer} ref={formRef}>
      <h1 className={`${styles.title} anim`}>Personal Details</h1>
      
      <form className={styles.form} onSubmit={handleRegister}>
        <div className={styles.formGrid}>
          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>E-mail</label>
            <input 
              type="email" 
              className={styles.input} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} required />
          </div>

          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>Name</label>
            <input type="text" className={styles.input} required />
          </div>

          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>Surname</label>
            <input type="text" className={styles.input} required />
          </div>

          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>Country</label>
            <input type="text" className={styles.input} defaultValue="United States" required />
          </div>

          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>Address</label>
            <input type="text" className={styles.input} required />
          </div>

          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>Locality</label>
            <input type="text" className={styles.input} required />
          </div>

          <div className={`${styles.inputGroup} anim`}>
            <label className={styles.label}>Postal Code</label>
            <input type="text" className={styles.input} required />
          </div>
        </div>

        <div className={`${styles.checkboxGroup} anim`}>
          <input type="checkbox" id="newsletter" className={styles.checkbox} />
          <label htmlFor="newsletter" className={styles.checkboxLabel}>
            I wish to receive personalized news from NIL by email.
          </label>
        </div>

        <div className={`${styles.checkboxGroup} anim`}>
          <input type="checkbox" id="privacy" className={styles.checkbox} required />
          <label htmlFor="privacy" className={styles.checkboxLabel}>
            I accept the privacy policy
          </label>
        </div>

        <div style={{ marginTop: '4rem' }} className="anim">
          <button type="submit" className={styles.submitBtn}>
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
