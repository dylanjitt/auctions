// src/components/ChatPanel.tsx
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useChat } from "../hooks/useChat";
import { useUser } from "../context/UserContext";

interface ChatPanelProps {
  productId: string;
}

export function ChatPanel({ productId }: ChatPanelProps) {
  const { user } = useUser()!;
  const { messages, sendMessage } = useChat(productId);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // auto‐scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    try {
      await sendMessage(input, user.username);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper sx={{ p: 2, height: 400, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>Chat</Typography>
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        <List>
          {messages.map((m) => (
            <ListItem key={m.id} alignItems="flex-start">
              <ListItemText
                primary={`${m.username} • ${new Date(m.timestamp).toLocaleTimeString()}`}
                secondary={m.content}
              />
            </ListItem>
          ))}
          <div ref={endRef} />
        </List>
      </Box>
      <Box
        component="form"
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        sx={{ display: "flex", gap: 1 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleSend}>Enviar</Button>
      </Box>
    </Paper>
  );
}
