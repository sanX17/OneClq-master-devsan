import LoginContent from "@/components/auth/login-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <LoginContent />;
}
