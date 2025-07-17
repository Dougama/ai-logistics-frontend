// packages/ui-web/src/features/chat/components/ChatWindow/ChatWindow.tsx (MIGRADO)

import React, { useRef, useEffect, memo, useCallback } from "react";
import { Container } from "@mantine/core";
import { IconArrowDown, IconMessage } from "@tabler/icons-react";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import type { ChatMessage } from "../../types";

interface ChatCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = React.useState(true);
  const [isUserScrolling, setIsUserScrolling] = React.useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Función simplificada para scroll al final
  const scrollToBottom = useCallback((force = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (force || isNearBottom || !isUserScrolling) {
      container.scrollTop = container.scrollHeight;
    }
  }, [isNearBottom, isUserScrolling]);

  // Detectar posición del scroll
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
    setIsNearBottom(isAtBottom);

    // Detectar si el usuario está scrolleando
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  }, []);

  // Auto-scroll cuando llegan nuevos mensajes o cuando está escribiendo
  useEffect(() => {
    if (messages.length > 0 || isReplying) {
      // Solo hacer auto-scroll si el usuario está cerca del final o no está scrolleando
      if (isNearBottom || !isUserScrolling) {
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  }, [messages.length, isReplying, scrollToBottom, isNearBottom, isUserScrolling]);

  // Configurar listener de scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^[📦🚚📊🗺️💰⏰]\s/, "");
    onSendMessage(cleanSuggestion);
  }, [onSendMessage]);

  const handleMessageSend = useCallback((text: string) => {
    onSendMessage(text);
    setTimeout(() => scrollToBottom(true), 100);
  }, [onSendMessage, scrollToBottom]);


  return (
    <>
      <div className="chat-window">
        {/* Área de mensajes con scroll optimizado */}
        <div 
          ref={scrollContainerRef}
          className="chat-window__messages"
        >
          <div 
            ref={messagesContainerRef}
            className="chat-messages-container"
          >
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
            
            {/* Espaciador adicional para asegurar que el último mensaje sea visible */}
            <div className="chat-messages-spacer" />
          </div>
        </div>
      </div>

      {/* Botón de scroll al final (aparece cuando el usuario no está cerca del final) */}
      {!isNearBottom && messages.length > 0 && (
        <div 
          className={`auto-scroll-indicator auto-scroll-indicator--visible`}
          onClick={() => scrollToBottom(true)}
        >
          <IconArrowDown size={16} />
          <span>Ir al final</span>
        </div>
      )}

      {/* Input de mensajes fuera del chat-window */}
      <MessageInput onSendMessage={handleMessageSend} isLoading={isReplying} />
    </>
  );
});
