import AuthContainer from "@/components/Auth/AuthContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NIL | Authenticate",
  description: "Sign in or create an account to access the void of style.",
};

export default function AuthPage() {
  return (
    <main>
      <AuthContainer />
    </main>
  );
}
