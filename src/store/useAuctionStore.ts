import {create} from 'zustand';
// import { persist } from "zustand/middleware";
import type { Product } from '../interfaces/productInterface';

interface AuctionState {
  products: Product[];
  setProducts: (items: Product[]) => void;
  updatePrice: (id: string, newPrice: number) => void;
  unloadProducts: ()=>void;
}

export const useAuctionStore = create<AuctionState>(set => ({
  products: [],
  setProducts: items => set({ products: items }),
  updatePrice: (id, price) =>
    set(state => ({
      products: state.products.map(p =>
        p.id === id? { ...p, precioBase: price } : p
      )
    })),
  unloadProducts: () => set({ products:[] }),
}));