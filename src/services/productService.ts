import bidInstance from "../api/bidInstance";
import jsonServerProductInstance from "../api/productsInstance";
import type { Bid } from "../interfaces/bidInterface";
import type { ChatMessage } from "../interfaces/ChatMessageInterface";
import type { Product } from "../interfaces/productInterface";
import { v4 as uuidv4 } from 'uuid';
export const productService = {
  
  async getProducts(){
    try {
      const response = await jsonServerProductInstance.get("/products");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch stations", error);
      throw error;
    }
  },

  async getProductById(id: string) {
    try {
      const response = await jsonServerProductInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product", error);
      throw error;
    }
  },

  async createProduct(product: Product): Promise<Product> {
    try {
      const response = await jsonServerProductInstance.post("/products", product);
      return response.data;
    } catch (error) {
      console.error("Failed to create product", error);
      throw error;
    }
  }, 

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      console.log("🔄 Updating product:", id, product);
      const response = await jsonServerProductInstance.patch(`/products/${id}`, product);
      console.log("✅ Product updated", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update product", error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await jsonServerProductInstance.delete(`/products/${id}`);
    } catch (error) {
      console.error("Failed to delete product", error);
      throw error;
    }
  },

  createBid: async (bid: Bid) => {
    try {
      const response = await jsonServerProductInstance.post('/bids', bid);
      try {
        await bidInstance.post('/bids', bid); // fire and forget SSE
      } catch (e) {
        console.warn("SSE POST failed, continuing anyway", e);
      }
      return response.data;
    } catch (error) {
      console.error("Failed to create bid", error);
      throw error;
    }
  },

  getBids: async (productId: string) => {
    const response = await jsonServerProductInstance.get(`/bids?productId=${productId}&_sort=timestamp&_order=desc`);
    return response.data;
  },
  getBidsByUser: async (userId: string) => {
    const response = await jsonServerProductInstance.get(`/bids?userId=${userId}&_sort=timestamp&_order=desc`);
    return response.data;
  },
  async getChatMessages(productId: string) {
    const response = await jsonServerProductInstance.get(
      `/chatMessages?productId=${productId}&_sort=timestamp&_order=asc`
    );
    return response.data;
  },
  async createChatMessage(msg: Omit<ChatMessage, 'id'>) {
    // Generamos un id aquí para que lodash-id no falle
    const withId = { ...msg, id: uuidv4() };
    const response = await jsonServerProductInstance.post('/chatMessages', withId);
    // También enviamos al SSE por el mock-server
    await bidInstance.post('/chatMessages', withId);
    return response.data;
  },
}