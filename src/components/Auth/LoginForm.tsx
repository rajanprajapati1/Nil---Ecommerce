"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Auth.module.css";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login by writing to Dexie
    await db.user.clear(); // Clear existing sessions if any
    await db.user.put({ email, loggedInAt: Date.now() });
    router.push("/");
  };

  return (
    <div className={styles.formContainer} ref={formRef}>
      <h1 className={`${styles.title} anim`}>Log in</h1>
      
      <form className={styles.form} onSubmit={handleLogin}>
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
        
        <div className={`${styles.forgotPassword} anim`}>
          Have your forgotten your password?
        </div>

        <div style={{ marginTop: '3rem' }}>
          <button type="submit" className={`${styles.submitBtn} anim`}>
            Log In
          </button>
        </div>
        
        <div className={styles.toggleLink} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Don't have an account? Create one
        </div>
      </form>
    </div>
  );
}
