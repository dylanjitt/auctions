import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/userService';
import type { User } from '../interfaces/userInterface';


interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (authUser?.id) {
        try {
          const response = await userService.getUsers();
          const customerData = response.find((customer: User) => customer.id === authUser.id);

          if (customerData) {
            setUser(customerData);
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }
    };

    fetchData();
  }, [authUser?.id]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};