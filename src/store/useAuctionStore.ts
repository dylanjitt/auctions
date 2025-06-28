import {create} from 'zustand';
import type {Product} from '../interfaces/productInterface';

interface AuctionState {
  products: Product[];
  setProducts: (items: Product[]) => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  products: [],
  setProducts: (items) => set({ products: items }),
}));