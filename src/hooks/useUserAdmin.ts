import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import type { User } from '../interfaces/userInterface';

export interface ManagedUser extends User {}

export const useUserAdmin = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await userService.getUsers();
      setUsers(all);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: Omit<User, 'id'>) => {
    setLoading(true);
    try {
      const newUser = await userService.createUser(data);
      setUsers(prev => [...prev, newUser]);
    } catch {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    setLoading(true);
    try {
      const updated = await userService.updateUser(id, data);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
    } catch {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, error, createUser, updateUser, deleteUser };
};