// services/register.ts
import jsonServerInstance from "../api/jsonInstance";

interface RegisterUser {
  username: string;
  rol: string;
  avatar?: string;
}

export const register = async (user: RegisterUser) => {
  const newUser = {
    ...user,
    usuario: user.username,
    avatar: user.avatar || `https://ui-avatars.com/api/?name${user.username}`,
  };

  const response = await jsonServerInstance.post('/users', newUser);
  return response.data;
};
