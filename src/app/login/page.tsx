import LoginPage from "@/app/component/auth/LoginPage";
import { AuthProvider } from "../contexts/AuthContext";

export default function Login() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}