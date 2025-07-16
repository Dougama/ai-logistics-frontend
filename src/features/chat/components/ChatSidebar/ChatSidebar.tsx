import React from 'react';
import {
  Stack,
  Button,
  Text,
  Group,
  ActionIcon,
  ScrollArea,
  Box,
  Tooltip,
  Menu,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconMessage,
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import type { ChatSummary } from '../../types';

interface ChatSidebarProps {
  chats: ChatSummary[];
  activeChatId: string | null;
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  isCollapsed?: boolean;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onLoadMore: () => void;
  onToggleCollapse?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  isLoading,
  hasMore,
  isLoadingMore,
  isCollapsed = false,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLoadMore,
  onToggleCollapse,
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
    <Box h="100%" style={{ display: 'flex', flexDirection: 'column', width: isCollapsed ? '60px' : '100%', transition: 'width 0.3s ease' }}>
      {/* Collapse toggle button - Desktop only */}
      {onToggleCollapse && (
        <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', padding: '8px 12px 0 12px' }}>
          <ActionIcon
            onClick={onToggleCollapse}
            variant="subtle"
            size="sm"
            className="sidebar-collapse-toggle"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: 'var(--color-charcoal)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '36px',
                minHeight: '36px',
                transition: 'all 0.15s ease',
                
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                },
                
                '&:active': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }
              }
            }}
          >
            {isCollapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
          </ActionIcon>
        </Box>
      )}

      {/* Header with new chat button */}
      <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', padding: '16px 12px 0 12px' }}>
        {/* New Chat Button */}
        {!isCollapsed ? (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={onNewChat}
            variant="subtle"
            styles={{
              root: {
                backgroundColor: 'var(--color-navy)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontWeight: '500',
                fontSize: '14px',
                minHeight: '40px',
                transition: 'all 0.15s ease',
                
                '&:hover': {
                  backgroundColor: '#2a4a6b',
                },
                
                '&:active': {
                  backgroundColor: '#1a365d',
                }
              }
            }}
          >
            Nuevo Chat
          </Button>
        ) : (
          <Button
            onClick={onNewChat}
            variant="subtle"
            size="sm"
            styles={{
              root: {
                backgroundColor: 'var(--color-navy)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '36px',
                minHeight: '36px',
                transition: 'all 0.15s ease',
                
                '&:hover': {
                  backgroundColor: '#2a4a6b',
                },
                
                '&:active': {
                  backgroundColor: '#1a365d',
                }
              }
            }}
          >
            <IconPlus size={16} />
          </Button>
        )}
      </Box>


      {/* Recientes Label */}
      {!isCollapsed && (
        <Box style={{ padding: '0 12px', marginBottom: '8px' }}>
          <Text size="xs" style={{ color: 'var(--color-charcoal)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recientes
          </Text>
        </Box>
      )}

      {/* Chat List Container - Only show when not collapsed */}
      {!isCollapsed && (
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
            <Stack gap="2px" pr="xs">
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
                <Tooltip key={chat.id} label={isCollapsed ? chat.title : ''} position="right" disabled={!isCollapsed}>
                  <Group
                    gap="sm"
                    p="8px 12px"
                    style={{
                      borderRadius: '6px',
                      cursor: 'pointer',
                      minHeight: '36px',
                      backgroundColor: chat.id === activeChatId ? 'rgba(45, 55, 72, 0.06)' : 'transparent',
                      borderLeft: chat.id === activeChatId ? '3px solid var(--color-navy)' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      
                      '&:hover': {
                        backgroundColor: chat.id === activeChatId ? 'rgba(45, 55, 72, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    {!isCollapsed && (
                      <>
                        <Text
                          size="sm"
                          style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                            color: chat.id === activeChatId ? 'var(--color-navy)' : 'var(--color-charcoal)',
                            fontWeight: chat.id === activeChatId ? '500' : '400',
                            fontSize: '14px',
                          }}
                        >
                          {chat.title}
                        </Text>

                        <Menu position="bottom-end" withinPortal>
                          <Menu.Target>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              style={{ 
                                flexShrink: 0,
                                color: 'var(--color-navy)',
                                opacity: 0.7,
                                transition: 'opacity 0.15s ease',
                                
                                '&:hover': {
                                  opacity: 1,
                                  backgroundColor: 'rgba(45, 55, 72, 0.1)',
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconDotsVertical size={14} />
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
                      </>
                    )}
                  </Group>
                </Tooltip>
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
      )}
    </Box>
  );
};

