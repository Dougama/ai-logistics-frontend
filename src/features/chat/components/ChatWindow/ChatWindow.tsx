// packages/ui-web/src/features/chat/components/ChatWindow/ChatWindow.tsx (MIGRADO)

import React, { useRef, useEffect, memo, useCallback } from "react";
import { Container } from "@mantine/core";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import { useOptimizedScroll } from "../../hooks/useOptimizedScroll";
import { useVirtualizedMessages } from "../../hooks/useVirtualizedMessages";
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

  // Hook de scroll optimizado
  const { scrollRef, scrollToBottom, isAtBottom } = useOptimizedScroll({
    smoothScroll: true,
    debounceTime: 100,
  });

  // Hook de virtualización para mensajes largos
  const {
    shouldVirtualize,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  } = useVirtualizedMessages(messages, {
    estimatedItemHeight: 100,
    overscan: 5,
    containerHeight: 600,
    virtualizationThreshold: 50,
  });

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      // Solo auto-scroll si el usuario está cerca del final
      if (isAtBottom() || messages.length === 1) {
        // Usar RAF para mejor rendimiento
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      }
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // Sincronizar scroll con virtualización
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !shouldVirtualize) return;

    const handleScrollEvent = () => {
      handleScroll(element.scrollTop);
    };

    element.addEventListener('scroll', handleScrollEvent, { passive: true });
    return () => element.removeEventListener('scroll', handleScrollEvent);
  }, [shouldVirtualize, handleScroll, scrollRef]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^[📦🚚📊🗺️💰⏰]\s/, "");
    onSendMessage(cleanSuggestion);
  }, [onSendMessage]);


  return (
    <>
      <div className="chat-window">
        {/* Área de mensajes con scroll optimizado */}
        <div 
          ref={scrollRef}
          className="chat-window__messages"
          style={{
            height: shouldVirtualize ? totalHeight : undefined,
          }}
        >
          <div 
            ref={messagesContainerRef}
            className="chat-messages-container"
            style={{
              transform: shouldVirtualize ? `translateY(${offsetY}px)` : undefined,
            }}
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

            {/* Mensajes - Renderizado normal o virtualizado */}
            {shouldVirtualize ? (
              // Renderizado virtualizado para listas largas
              visibleItems.map((item) => (
                <MessageBubble 
                  key={item.message.id} 
                  message={item.message}
                />
              ))
            ) : (
              // Renderizado normal para listas cortas
              messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            )}

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

      {/* Input de mensajes fuera del chat-window */}
      <MessageInput onSendMessage={onSendMessage} isLoading={isReplying} />
    </>
  );
});
