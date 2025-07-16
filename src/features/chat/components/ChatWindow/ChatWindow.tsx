// packages/ui-web/src/features/chat/components/ChatWindow/ChatWindow.tsx (MIGRADO)

import React, { useRef, useEffect, memo, useCallback } from "react";
import { Container } from "@mantine/core";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import type { ChatMessage } from "../../types";

interface ChatCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isReplying: boolean;
  showWelcome?: boolean;
  categories?: ChatCategory[];
  onCategoryClick?: (categoryId: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = memo(({
  messages,
  onSendMessage,
  isReplying,
  showWelcome = true,
  categories = [],
  onCategoryClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^[📦🚚📊🗺️💰⏰]\s/, "");
    onSendMessage(cleanSuggestion);
  }, [onSendMessage]);


  return (
    <div className="chat-window">
      {/* Área de mensajes */}
      <div className="chat-window__messages">
        <div className="chat-messages-container">
          {messages.length === 0 && !isReplying && showWelcome && (
            <div className="chat-window__empty">
              <div className="chat-greeting">
                <h2 className="chat-greeting__title">Hola, soy tu agente</h2>
                <p className="chat-greeting__subtitle">
                  ¿Cómo te puedo ayudar hoy?
                </p>
              </div>

              {/* Grid de categorías */}
              {categories.length > 0 && (
                <div className="chat-actions-grid">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <div
                        key={category.id}
                        className="chat-action-card"
                        onClick={() => onCategoryClick?.(category.id)}
                      >
                        <div className="chat-action-card__icon">
                          <IconComponent size={28} />
                        </div>
                        <h3 className="chat-action-card__title">{category.title}</h3>
                        <p className="chat-action-card__description">{category.subtitle}</p>
                      </div>
                    );
                  })}
                </div>
              )}
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
        </div>
      </div>

      {/* Input de mensajes */}
      <MessageInput onSendMessage={onSendMessage} isLoading={isReplying} />
    </div>
  );
});
