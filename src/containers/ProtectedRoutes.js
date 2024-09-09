import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

const ProtectedRoute = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    // Redirect ke halaman login jika sesi tidak ada
    router.push("/login");
    return null;
  }

  return children;
};

export default ProtectedRoute;
