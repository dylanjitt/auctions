// src/hooks/useChat.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { productService } from "../services/productService";
import type { ChatMessage } from "../interfaces/ChatMessageInterface";

export function useChat(productId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const sseRef = useRef<EventSource | null>(null);

  // --- Carga inicial del historial ---
  useEffect(() => {
    if (!productId) return;
    productService
      .getChatMessages(productId)
      .then(setMessages)
      .catch(console.error);
  }, [productId]);

  // --- Subscripción SSE y reconexión ---
  useEffect(() => {
    if (!productId) return;
    let isMounted = true;

    const setup = () => {
      const es = new EventSource(`http://localhost:3003/api/products/${productId}/stream`);
      sseRef.current = es;

      es.addEventListener("NEW_CHAT_MESSAGE", (e) => {
        const { payload } = JSON.parse(e.data);
        if (!isMounted) return;
        setMessages((prev) => [
          ...prev,
          { ...payload, id: payload.id.toString() },
        ]);
      });

      es.onerror = () => {
        es.close();
        sseRef.current = null;
        // reintentar en 2s
        setTimeout(setup, 2000);
      };
    };

    setup();
    return () => {
      isMounted = false;
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, [productId]);

  // --- Función para enviar mensaje ---
  const sendMessage = useCallback(
    async (content: string, username: string) => {
      if (!productId || !content.trim()) return;
      try {
        await productService.createChatMessage({
          productId,
          username,
          content,
          timestamp: new Date().toISOString(),
        });
        // no hace falta más: el SSE disparará NEW_CHAT_MESSAGE
      } catch (err) {
        console.error("Failed to send chat message:", err);
      }
    },
    [productId]
  );

  return { messages, sendMessage };
}
