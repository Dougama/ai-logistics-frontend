export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
}

export interface ChatSummary {
  id: string;
  title: string;
  lastUpdatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface ChatResponse {
  id: string;
  content: string;
  timestamp: string;
  chatId?: string;
}

export interface CreateChatResponse {
  id: string;
  content: string;
  timestamp: string;
  chatId: string;
}

export interface SendMessageResponse {
  id: string;
  content: string;
  timestamp: string;
  chatId?: string;
}

