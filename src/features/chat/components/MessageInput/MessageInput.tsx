// packages/ui-web/src/features/chat/components/MessageInput/MessageInput.tsx (MIGRADO)

import React, { useState } from "react";
import { Container } from "@mantine/core";
import { IconSend, IconSparkles } from "@tabler/icons-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const hasContent = inputValue.trim().length > 0;

  return (
    <div className="message-input-fixed">
      <form onSubmit={handleSubmit} className="message-input-fixed__form">
        <textarea
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
          className="message-input-fixed__field"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={!hasContent || isLoading}
          className="message-input-fixed__button"
        >
          {isLoading ? (
            <IconSparkles className="message-input-fixed__icon loading" />
          ) : (
            <IconSend className="message-input-fixed__icon" />
          )}
        </button>
      </form>
    </div>
  );
};
