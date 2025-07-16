import React, { useState, useCallback } from "react";
import { useAuth } from "../../../shared/services/auth";
import { ChatWindow } from "../components/ChatWindow";
import { useChatList } from "../hooks/useChatList";
import { chatService, messageService } from "../services";
import type { ChatMessage } from "../types";

// Import chat component styles
import "../../../styles/components/chat.css";

export const ChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Estados locales para mensajes
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isReplying, setIsReplying] = useState(false);

  const userId = currentUser?.uid || "user123";
  const { addNewChat } = useChatList(userId);


  // Enviar mensaje
  const handleSendMessage = useCallback(
    async (text: string) => {
      console.log("🚀 Enviando mensaje:", text);

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsReplying(true);

      try {
        let response;

        if (activeChatId) {
          console.log("📤 Enviando a chat existente:", activeChatId);
          response = await chatService.sendMessage(activeChatId, text);
        } else {
          console.log("🆕 Creando nuevo chat");
          response = await chatService.createChat(text);
        }

        console.log("📥 Respuesta del servidor:", response);

        const assistantMessage: ChatMessage = {
          id: response.id,
          role: "assistant",
          content: response.content,
          timestamp: new Date(response.timestamp),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Si es un chat nuevo, actualizar el ID y agregar a la lista
        if (!activeChatId && response.chatId) {
          setActiveChatId(response.chatId);
          addNewChat({
            id: response.chatId,
            title: messageService.generateChatTitle(text),
          });
        }
      } catch (error) {
        console.error("❌ Error enviando mensaje:", error);

        // Remover el mensaje del usuario si hay error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

        // Mostrar error al usuario
        alert(
          "Error al enviar el mensaje. Por favor, verifica que el servidor esté funcionando."
        );
      } finally {
        setIsReplying(false);
      }
    },
    [activeChatId, addNewChat]
  );


  return (
    <div className="chat-page-minimal">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isReplying={isReplying}
      />
    </div>
  );
};
