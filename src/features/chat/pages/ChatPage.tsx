import React, { useState, useCallback } from "react";
import { useAuth } from "../../../shared/services/auth";
import { ChatWindow } from "../components/ChatWindow";
import { useChatList } from "../hooks/useChatList";
import { chatService, messageService } from "../services";
import type { ChatMessage } from "../types";
import { 
  IconChartBar, 
  IconFlag, 
  IconUsers, 
  IconNews, 
  IconBook, 
  IconBulb 
} from "@tabler/icons-react";

// Import chat component styles
import "../../../styles/components/chat.css";

export const ChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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


  // Chat categories data
  const chatCategories = [
    {
      id: "insights",
      title: "Insights",
      subtitle: "Análisis y métricas",
      icon: IconChartBar,
      color: "accent",
    },
    {
      id: "reportar",
      title: "Reportar",
      subtitle: "Registrar eventos",
      icon: IconFlag,
      color: "primary",
    },
    {
      id: "clientes",
      title: "Clientes",
      subtitle: "Consultar clientes",
      icon: IconUsers,
      color: "secondary",
    },
    {
      id: "noticias",
      title: "Noticias",
      subtitle: "Eventos y avisos",
      icon: IconNews,
      color: "accent",
    },
    {
      id: "documentacion",
      title: "Documentación",
      subtitle: "Manuales y guías",
      icon: IconBook,
      color: "primary",
    },
    {
      id: "sugerencias",
      title: "Sugerencias",
      subtitle: "Ideas de conversación",
      icon: IconBulb,
      color: "secondary",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Generar mensaje inicial basado en la categoría
    const category = chatCategories.find(c => c.id === categoryId);
    if (category) {
      const initialMessages = {
        insights: "Muéstrame insights de reparto",
        reportar: "Quiero reportar una incidencia",
        clientes: "Búsqueda de clientes", 
        noticias: "Últimas noticias y eventos",
        documentacion: "Necesito consultar documentación",
        sugerencias: "Dame sugerencias sobre qué preguntar"
      };
      
      const message = initialMessages[categoryId as keyof typeof initialMessages] || `Ayúdame con ${category.title}`;
      handleSendMessage(message);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setMessages([]);
    setActiveChatId(null);
  };

  // Siempre mostrar el chat, las categorías van dentro del ChatWindow
  return (
    <div className="chat-page-minimal">
      <div className="chat-header">
        <h1 className="chat-main-title">Asistente IA</h1>
        {messages.length === 0 && (
          <p className="chat-main-subtitle">Selecciona un tema para empezar a chatear</p>
        )}
      </div>
      
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isReplying={isReplying}
        showWelcome={true}
        categories={chatCategories}
        onCategoryClick={handleCategoryClick}
      />
    </div>
  );
};
