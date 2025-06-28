import { Navigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { useContext } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const userContext = useContext(UserContext)
  const isAuthenticated = userContext?.user!==null;
  return <>{isAuthenticated ? children : <Navigate to="/login" />}</>;
};

export default AuthGuard;