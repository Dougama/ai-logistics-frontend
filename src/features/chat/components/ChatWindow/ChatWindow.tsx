// packages/ui-web/src/features/chat/components/ChatWindow/ChatWindow.tsx (MIGRADO)

import React, { useRef, useEffect, memo, useCallback } from "react";
import { Container } from "@mantine/core";
import { IconArrowDown, IconMessage } from "@tabler/icons-react";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import { useDynamicPadding } from "../../hooks/useDynamicPadding";
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

export const ChatWindow: React.FC<ChatWindowProps> = memo(
  ({
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
    const [userWantsAutoScroll, setUserWantsAutoScroll] = React.useState(true);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const lastMessageCountRef = useRef(0);

    // Función simplificada para scroll al final
    const scrollToBottom = useCallback(
      (force = false) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (force || (userWantsAutoScroll && isNearBottom)) {
          container.scrollTop = container.scrollHeight;
          setUserWantsAutoScroll(true); // Restablecer después de scroll manual
        }
      },
      [isNearBottom, userWantsAutoScroll]
    );

    // Detectar posición del scroll
    const handleScroll = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setIsNearBottom(isAtBottom);

      // Detectar si el usuario está scrolleando manualmente hacia arriba
      setIsUserScrolling(true);

      // Si el usuario hace scroll hacia arriba significativamente, desactivar auto-scroll
      if (scrollTop < scrollHeight - clientHeight - 200) {
        setUserWantsAutoScroll(false);
      }

      // Si el usuario vuelve cerca del final, reactivar auto-scroll
      if (isAtBottom) {
        setUserWantsAutoScroll(true);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1000);
    }, []);

    // Auto-scroll inteligente
    useEffect(() => {
      const currentMessageCount = messages.length;
      const hasNewMessages = currentMessageCount > lastMessageCountRef.current;

      if (hasNewMessages && currentMessageCount > 0) {
        const lastMessage = messages[messages.length - 1];
        const isUserMessage = lastMessage.role === "user";

        // Siempre auto-scroll para mensajes del usuario
        if (isUserMessage) {
          setTimeout(() => scrollToBottom(true), 100);
        }
        // Auto-scroll para mensajes del asistente solo si el usuario quiere auto-scroll
        else if (userWantsAutoScroll && isNearBottom) {
          setTimeout(() => scrollToBottom(), 100);
        }
      }

      // Auto-scroll cuando aparece indicador de escritura (solo si usuario quiere auto-scroll)
      if (isReplying && userWantsAutoScroll && isNearBottom) {
        setTimeout(() => scrollToBottom(), 100);
      }

      lastMessageCountRef.current = currentMessageCount;
    }, [
      messages.length,
      isReplying,
      scrollToBottom,
      userWantsAutoScroll,
      isNearBottom,
      messages,
    ]);

    // Configurar listener de scroll
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
        // Limpiar timeout al desmontar
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = undefined;
        }
      };
    }, [handleScroll]);

    // Cleanup general al desmontar el componente
    useEffect(() => {
      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    const handleSuggestionClick = useCallback(
      (suggestion: string) => {
        const cleanSuggestion = suggestion.replace(/^[📦🚚📊🗺️💰⏰]\s/, "");
        onSendMessage(cleanSuggestion);
      },
      [onSendMessage]
    );

    const handleMessageSend = useCallback(
      (text: string) => {
        onSendMessage(text);
        // Reactivar auto-scroll cuando el usuario envía un mensaje
        setUserWantsAutoScroll(true);
        setTimeout(() => scrollToBottom(true), 100);
      },
      [onSendMessage, scrollToBottom]
    );

    // Hook para padding dinámico
    const { updatePadding } = useDynamicPadding(messagesContainerRef, {
      enabled: true,
      extraPadding: 20,
      debug: false,
    });

    // Actualizar padding cuando cambian los mensajes (debounced)
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        updatePadding();
      }, 50);

      return () => clearTimeout(timeoutId);
    }, [messages.length, updatePadding]);

    return (
      <>
        <div className="chat-window">
          {/* Área de mensajes con scroll optimizado */}
          <div ref={scrollContainerRef} className="chat-window__messages">
            <div ref={messagesContainerRef} className="chat-messages-container">
              {messages.length === 0 && !isReplying && showWelcome && (
                <div className="chat-window__empty">
                  <div className="chat-greeting">
                    <h2 className="chat-greeting__title">
                      Hola, soy tu agente
                    </h2>
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
                            <h3 className="chat-action-card__title">
                              {category.title}
                            </h3>
                            <p className="chat-action-card__description">
                              {category.subtitle}
                            </p>
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
            onClick={() => {
              setUserWantsAutoScroll(true);
              scrollToBottom(true);
            }}
          >
            <IconArrowDown size={16} />
            <span>{userWantsAutoScroll ? "Ir al final" : "Ir al final"}</span>
          </div>
        )}

        {/* Input de mensajes fuera del chat-window */}
        <MessageInput
          onSendMessage={handleMessageSend}
          isLoading={isReplying}
        />
      </>
    );
  }
);
