import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  rol: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context with default undefined
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider props interface
interface UserProviderProps {
  children: ReactNode;
}

// Context Provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(()=>{
    console.log("Current user:",user)
  },[user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Optional: Custom hook for easier access
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
