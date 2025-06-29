import {create} from 'zustand';
import type { Product } from '../interfaces/productInterface';

interface AuctionState {
  products: Product[];
  setProducts: (items: Product[]) => void;
  updatePrice: (id: string, newPrice: number) => void;
}

export const useAuctionStore = create<AuctionState>(set => ({
  products: [],
  setProducts: items => set({ products: items }),
  updatePrice: (id, price) =>
    set(state => ({
      products: state.products.map(p =>
        p.id.toString() === id.toString() ? { ...p, precioBase: price } : p
      )
    })),
}));