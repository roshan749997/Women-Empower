import SignupPage from "@/app/component/auth/SignupPage";
import { AuthProvider } from "../contexts/AuthContext";

export default function Signup() {
  return (
    <AuthProvider>
      <SignupPage />
    </AuthProvider>
  );
}
