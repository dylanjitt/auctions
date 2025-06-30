import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const RoleBasedRedirect = () => {
  const { user } = useAuthStore( state => state);
  if (!user.rol) {
    return <Navigate to="/login" replace />;
  }
  if (user.rol === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (user.rol === 'user') {
    return <Navigate to="/home" replace />;
  }
};