import React from 'react';
import {
  Stack,
  Button,
  Text,
  Group,
  ActionIcon,
  ScrollArea,
  Divider,
  Box,
  Tooltip,
  Menu,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconMessage,
  IconDots,
} from '@tabler/icons-react';
import type { ChatSummary } from '../../types';

interface ChatSidebarProps {
  chats: ChatSummary[];
  activeChatId: string | null;
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onLoadMore: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  isLoading,
  hasMore,
  isLoadingMore,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLoadMore,
}) => {
  const handleDeleteChat = async (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await onDeleteChat(chatId);
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Hubo un error al intentar eliminar la conversación.');
    }
  };

  return (
    <Box h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={onNewChat}
        variant="subtle"
        fullWidth
        mb="md"
        styles={{
          root: {
            backgroundColor: 'var(--color-navy)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-component-md)',
            fontWeight: 'var(--font-medium)',
          }
        }}
      >
        Nuevo Chat
      </Button>

      <Divider mb="md" />

      {/* Chat List Container */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ScrollArea 
          style={{ 
            flex: 1,
            maxHeight: 'calc(50vh - 100px)', /* Reducido a la mitad */
          }} 
          type="hover"
          scrollbarSize={6}
          styles={{
            scrollbar: {
              '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                backgroundColor: 'var(--color-charcoal)',
                opacity: 0.4,
              }
            }
          }}
        >
          <Stack gap="xs" pr="xs">
            {isLoading ? (
              <Text ta="center" c="dimmed" size="sm">
                Cargando chats...
              </Text>
            ) : chats.length === 0 ? (
              <Text ta="center" c="dimmed" size="sm">
                No hay conversaciones aún
              </Text>
            ) : (
              chats.map((chat) => (
                <Group
                  key={chat.id}
                  gap="xs"
                  p="sm"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    backgroundColor:
                      chat.id === activeChatId
                        ? 'var(--color-light)'
                        : 'transparent',
                    border:
                      chat.id === activeChatId
                        ? '1px solid var(--color-navy)'
                        : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <IconMessage
                    size={16}
                    style={{
                      flexShrink: 0,
                      color:
                        chat.id === activeChatId
                          ? 'var(--color-navy)'
                          : 'var(--color-charcoal)',
                    }}
                  />

                  <Text
                    size="sm"
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                      color: chat.id === activeChatId ? 'var(--color-navy)' : 'var(--color-charcoal)'
                    }}
                  >
                    {chat.title}
                  </Text>

                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="gray"
                        style={{ flexShrink: 0 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDots size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                      >
                        Eliminar
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              ))
            )}
          </Stack>
        </ScrollArea>
        
        {/* Load More Button - Outside ScrollArea */}
        {!isLoading && hasMore && (
          <Box pt="sm">
            <Button
              variant="subtle"
              size="sm"
              onClick={onLoadMore}
              loading={isLoadingMore}
              fullWidth
              styles={{
                root: {
                  color: 'var(--color-charcoal)',
                  fontSize: '12px',
                }
              }}
            >
              {isLoadingMore ? 'Cargando...' : 'Ver más'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

