// packages/ui-web/src/features/chat/components/ChatWindow/ChatWindow.tsx (MIGRADO)

import React, { useRef, useEffect, memo, useCallback } from "react";
import { Container } from "@mantine/core";
import { IconArrowDown, IconMessage } from "@tabler/icons-react";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import { useOptimizedScroll } from "../../hooks/useOptimizedScroll";
import { useVirtualizedMessages } from "../../hooks/useVirtualizedMessages";
import { useAutoScroll } from "../../hooks/useAutoScroll";
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

  // Hook de auto-scroll inteligente
  const {
    scrollContainerRef,
    bottomElementRef,
    scrollToBottom,
    scrollToBottomImmediate,
    isNearBottom,
    isUserScrolling,
  } = useAutoScroll({
    enabled: true,
    delay: 100, // Reducir delay para respuesta más rápida
    behavior: 'smooth',
    threshold: 100, // Reducir threshold para activar más fácilmente
    debug: true, // Habilitar debug temporalmente
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
    if (messages.length === 0) return;

    // Si es la primera carga, scroll inmediato
    if (messages.length === 1) {
      scrollToBottomImmediate();
      return;
    }

    // Si hay nuevos mensajes y el usuario está cerca del final, hacer scroll
    if (isNearBottom || !isUserScrolling) {
      scrollToBottom();
    }
  }, [messages.length, isNearBottom, isUserScrolling, scrollToBottom, scrollToBottomImmediate]);

  // Auto-scroll cuando aparece el indicador de escritura
  useEffect(() => {
    if (isReplying && (isNearBottom || !isUserScrolling)) {
      scrollToBottom();
    }
  }, [isReplying, isNearBottom, isUserScrolling, scrollToBottom]);

  // Scroll inicial cuando se carga un chat existente
  useEffect(() => {
    if (messages.length > 1) {
      // Delay pequeño para asegurar que el DOM esté renderizado
      setTimeout(() => {
        scrollToBottomImmediate();
      }, 100);
    }
  }, []); // Solo en mount inicial

  // Sincronizar scroll con virtualización
  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element || !shouldVirtualize) return;

    const handleScrollEvent = () => {
      handleScroll(element.scrollTop);
    };

    element.addEventListener('scroll', handleScrollEvent, { passive: true });
    return () => element.removeEventListener('scroll', handleScrollEvent);
  }, [shouldVirtualize, handleScroll, scrollContainerRef]);

  // Auto-scroll directo y robusto cuando cambian los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      // Triple método para asegurar scroll completo
      const scrollToEnd = () => {
        if (messagesEndRef.current) {
          const container = messagesEndRef.current.closest('.chat-window__messages') as HTMLElement;
          if (container) {
            // Método 1: Scroll directo al final + buffer
            const maxScroll = container.scrollHeight - container.clientHeight;
            container.scrollTop = maxScroll + 100; // Buffer extra para garantizar visibilidad
            
            console.log('🔥 SCROLL FORZADO:', {
              scrollHeight: container.scrollHeight,
              clientHeight: container.clientHeight,
              maxScroll,
              finalScrollTop: container.scrollTop,
              buffer: 100
            });
          }
        }
      };

      // Ejecutar múltiples veces para garantizar que funcione
      requestAnimationFrame(() => {
        scrollToEnd();
        setTimeout(scrollToEnd, 50);
        setTimeout(scrollToEnd, 200);
        setTimeout(scrollToEnd, 500);
      });
    }
  }, [messages.length]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^[📦🚚📊🗺️💰⏰]\s/, "");
    onSendMessage(cleanSuggestion);
  }, [onSendMessage]);

  const handleMessageSend = useCallback((text: string) => {
    onSendMessage(text);
    // Scroll forzado cuando el usuario envía un mensaje
    setTimeout(() => scrollToBottom(true), 100);
  }, [onSendMessage, scrollToBottom]);


  return (
    <>
      <div className="chat-window">
        {/* Área de mensajes con scroll optimizado */}
        <div 
          ref={scrollContainerRef}
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
            <div ref={bottomElementRef} className="chat-messages-spacer" />
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
