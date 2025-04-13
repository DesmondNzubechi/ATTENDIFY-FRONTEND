
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser, isLoading } = useUserStore();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
