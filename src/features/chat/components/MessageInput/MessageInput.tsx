// packages/ui-web/src/features/chat/components/MessageInput/MessageInput.tsx (MIGRADO)

import React, { useState } from "react";
import { Container, Menu } from "@mantine/core";
import {
  IconSend,
  IconSparkles,
  IconPlus,
  IconPhoto,
  IconPaperclip,
  IconMicrophone,
  IconArrowUp,
} from "@tabler/icons-react";

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
        {/* Contenedor de botones izquierdos */}
        <div className="message-input-fixed__left-buttons">
          {/* Botón micrófono encima */}
          <button
            type="button"
            className="message-input-fixed__mic-button"
            disabled={isLoading}
            onClick={() => console.log("Micrófono activado")}
          >
            <IconMicrophone size={20} />
          </button>

          {/* Botón + con menú debajo */}
          <Menu position="top-start" withinPortal>
            <Menu.Target>
              <button
                type="button"
                className="message-input-fixed__plus-button"
                disabled={isLoading}
              >
                <IconPlus size={20} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPhoto size={16} />}
                onClick={() => console.log("Imagen seleccionada")}
              >
                Imagen
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPaperclip size={16} />}
                onClick={() => console.log("Archivo seleccionado")}
              >
                Archivo
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <textarea
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          placeholder="Responder a tracko..."
          disabled={isLoading}
          className="message-input-fixed__field"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={!hasContent || isLoading}
          className="message-input-fixed__button"
        >
          {isLoading ? (
            <IconSparkles className="message-input-fixed__icon loading" />
          ) : (
            <IconArrowUp className="message-input-fixed__icon" />
          )}
        </button>
      </form>
    </div>
  );
};
