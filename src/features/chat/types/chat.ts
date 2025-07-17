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
  data?: {
    compensationData?: {
      compensationList: Array<{
        id: string;
        kpi_entrega_en_rango: number;
        kpi_recargues: number;
        kpi_refusal: number;
        nombre: string;
        fecha: string;
        cedula: string;
        variable: number;
        variableMes: number;
        [key: string]: any;
      }>;
      parameters: {
        kpi_entrega_en_rango_goal: number;
        kpi_recargues_goal: number;
        kpi_refusal_goal: number;
        entrega_en_rango_w: number;
        recargues_w: number;
        refusal_w: number;
        [key: string]: any;
      };
      total_registros: number;
    };
    [key: string]: any;
  };
}

export interface SendMessageResponse {
  id: string;
  content: string;
  timestamp: string;
  chatId?: string;
  data?: {
    compensationData?: {
      compensationList: Array<{
        id: string;
        kpi_entrega_en_rango: number;
        kpi_recargues: number;
        kpi_refusal: number;
        nombre: string;
        fecha: string;
        cedula: string;
        variable: number;
        variableMes: number;
        [key: string]: any;
      }>;
      parameters: {
        kpi_entrega_en_rango_goal: number;
        kpi_recargues_goal: number;
        kpi_refusal_goal: number;
        entrega_en_rango_w: number;
        recargues_w: number;
        refusal_w: number;
        [key: string]: any;
      };
      total_registros: number;
    };
    [key: string]: any;
  };
}

