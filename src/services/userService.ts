import jsonServerInstance from "../api/jsonInstance";
import type { User } from "../interfaces/userInterface"; // You'll need to create this interface

export const userService = {
  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await jsonServerInstance.get("/users");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users", error);
      throw error;
    }
  },

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await jsonServerInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user", error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      // Set default avatar if not provided
      const userWithDefaults = {
        ...user,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.username}`,
      };

      const response = await jsonServerInstance.post("/users", userWithDefaults);
      return response.data;
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
  },

  /**
   * Update an existing user
   */
  async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<User> {
    try {
      const response = await jsonServerInstance.patch(
        `/users/${encodeURIComponent(id)}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update user", error);
      throw error;
    }
  },

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await jsonServerInstance.delete(`/users/${id}`);
    } catch (error) {
      console.error("Failed to delete user", error);
      throw error;
    }
  },

};