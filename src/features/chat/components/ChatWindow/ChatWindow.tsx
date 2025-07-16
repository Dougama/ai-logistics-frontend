// packages/ui-web/src/features/chat/components/ChatWindow/ChatWindow.tsx (MIGRADO)

import React, { useRef, useEffect, memo, useCallback } from "react";
import { Container } from "@mantine/core";
import { 
  IconChartPie, 
  IconEdit, 
  IconUsers, 
  IconNews,
  IconBook,
  IconBulb
} from "@tabler/icons-react";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import type { ChatMessage } from "../../types";

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isReplying: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = memo(({
  messages,
  onSendMessage,
  isReplying,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^[📦🚚📊🗺️💰⏰]\s/, "");
    onSendMessage(cleanSuggestion);
  }, [onSendMessage]);

  const handleFeatureClick = useCallback((question: string) => {
    onSendMessage(question);
  }, [onSendMessage]);

  const quickActions = [
    {
      icon: IconChartPie,
      title: "Insights",
      description: "Análisis y métricas",
      question: "Muéstrame insights de reparto"
    },
    {
      icon: IconEdit,
      title: "Reportar",
      description: "Registrar eventos",
      question: "Quiero reportar una incidencia"
    },
    {
      icon: IconUsers,
      title: "Clientes",
      description: "Consultar clientes",
      question: "Búsqueda de clientes"
    },
    {
      icon: IconNews,
      title: "Noticias",
      description: "Eventos y avisos",
      question: "Últimas noticias y eventos"
    },
    {
      icon: IconBook,
      title: "Documentación",
      description: "Manuales y guías",
      question: "Necesito consultar documentación"
    },
    {
      icon: IconBulb,
      title: "Sugerencias",
      description: "Ideas de conversación",
      question: "Dame sugerencias sobre qué preguntar"
    }
  ];

  return (
    <div className="chat-window">
      {/* Área de mensajes */}
      <div className="chat-window__messages">
        <Container size="md">
          {messages.length === 0 && !isReplying && (
            <div className="chat-window__empty">
              {/* Saludo */}
              <div className="chat-greeting">
                <h2 className="chat-greeting__title">Hola, soy tu agente</h2>
                <p className="chat-greeting__subtitle">
                  ¿Cómo te puedo ayudar hoy?
                </p>
              </div>

              {/* Grid de 6 tarjetas */}
              <div className="chat-actions-grid">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={index}
                      className="chat-action-card"
                      onClick={() => handleFeatureClick(action.question)}
                    >
                      <div className="chat-action-card__icon">
                        <Icon size={28} />
                      </div>
                      <h3 className="chat-action-card__title">{action.title}</h3>
                      <p className="chat-action-card__description">{action.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mensajes */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Indicador de escritura */}
          {isReplying && (
            <div className="typing-indicator">
              <div className="typing-indicator__header">
                <div className="typing-indicator__info">
                  <p className="typing-indicator__name">Tracko</p>
                  <p className="typing-indicator__status">
                    está escribiendo...
                  </p>
                </div>
              </div>

              <div className="typing-indicator__content">
                <div className="typing-indicator__dots">
                  <div className="typing-indicator__dot"></div>
                  <div className="typing-indicator__dot"></div>
                  <div className="typing-indicator__dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </Container>
      </div>

      {/* Input de mensajes */}
      <MessageInput onSendMessage={onSendMessage} isLoading={isReplying} />
    </div>
  );
});
