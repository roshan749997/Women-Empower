import ProfilePage from "../component/profile/ProfilePage";
import { AuthProvider } from "../contexts/AuthContext";

export default function Profile() {
  return (
    <AuthProvider>
      <ProfilePage />
    </AuthProvider>
  );
}