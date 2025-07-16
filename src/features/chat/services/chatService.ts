import { apiClient } from '../../../shared/services/api';
import type { Chat, ChatSummary, CreateChatResponse, SendMessageResponse, ChatMessage } from '../types';

export class ChatService {
  async getUserChats(userId: string, lastSeen?: number): Promise<ChatSummary[]> {
    const endpoint = lastSeen 
      ? `/chat/user/${userId}?lastSeen=${lastSeen}`
      : `/chat/user/${userId}`;
    
    return apiClient.get<ChatSummary[]>(endpoint);
  }

  async createChat(prompt: string): Promise<CreateChatResponse> {
    return apiClient.post<CreateChatResponse>('/chat', { prompt });
  }

  async sendMessage(chatId: string, prompt: string): Promise<SendMessageResponse> {
    return apiClient.post<SendMessageResponse>(`/chat/${chatId}`, { prompt });
  }

  async deleteChat(chatId: string): Promise<void> {
    return apiClient.delete(`/chat/${chatId}`);
  }

  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(`/chat/${chatId}/messages`);
  }
}

export const chatService = new ChatService();

