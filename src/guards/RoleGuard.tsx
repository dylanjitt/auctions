import { type ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; 

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, redirectTo = '/login' }) => {
  const userContext = useContext(UserContext);

  if (!userContext?.user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(userContext.user.rol)) {
    return <Navigate to="/home" replace />; // Default redirection for unauthorized roles
  }

  return <>{children}</>;
};
