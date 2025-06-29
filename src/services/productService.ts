import jsonServerProductInstance from "../api/productsInstance";
import type { Bid } from "../interfaces/bidInterface";
import type { Product } from "../interfaces/productInterface";
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

  async updateProduct(
    id: string,
    product: Partial<Product>
  ): Promise<Product> {
    try {
      const response = await jsonServerProductInstance.patch(`/products/${encodeURIComponent(id)}`, product);
      return response.data;
    } catch (error) {
      console.error("Failed to update product", error);
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
    const response = await jsonServerProductInstance.post('/bids', bid);
    return response.data;
  },

  getBids: async (productId: string) => {
    const response = await jsonServerProductInstance.get(`/bids?productId=${productId}&_sort=timestamp&_order=desc`);
    return response.data;
  }

}