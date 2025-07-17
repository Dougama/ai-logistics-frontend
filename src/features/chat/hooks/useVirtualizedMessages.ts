// src/features/chat/hooks/useVirtualizedMessages.ts
import { useMemo, useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types';

interface UseVirtualizedMessagesOptions {
  /** Altura estimada por mensaje */
  estimatedItemHeight?: number;
  /** Número de mensajes a renderizar por encima/debajo del viewport */
  overscan?: number;
  /** Altura del contenedor visible */
  containerHeight?: number;
  /** Umbral para activar virtualización */
  virtualizationThreshold?: number;
}

interface VirtualizedItem {
  index: number;
  message: ChatMessage;
  top: number;
  height: number;
}

export const useVirtualizedMessages = (
  messages: ChatMessage[],
  options: UseVirtualizedMessagesOptions = {}
) => {
  const {
    estimatedItemHeight = 100,
    overscan = 5,
    containerHeight = 600,
    virtualizationThreshold = 50,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [measuredHeights, setMeasuredHeights] = useState<Map<string, number>>(new Map());

  // Determinar si usar virtualización
  const shouldVirtualize = messages.length > virtualizationThreshold;

  // Calcular alturas y posiciones
  const itemData = useMemo(() => {
    let accumulatedHeight = 0;
    
    return messages.map((message, index) => {
      const height = measuredHeights.get(message.id) || estimatedItemHeight;
      const top = accumulatedHeight;
      
      accumulatedHeight += height;
      
      return {
        index,
        message,
        top,
        height,
      };
    });
  }, [messages, measuredHeights, estimatedItemHeight]);

  // Calcular altura total
  const totalHeight = useMemo(() => {
    return itemData.reduce((sum, item) => sum + item.height, 0);
  }, [itemData]);

  // Calcular elementos visibles
  const visibleItems = useMemo(() => {
    if (!shouldVirtualize) {
      return itemData;
    }

    const start = Math.max(0, scrollTop - overscan * estimatedItemHeight);
    const end = scrollTop + containerHeight + overscan * estimatedItemHeight;

    return itemData.filter(item => {
      const itemEnd = item.top + item.height;
      return itemEnd >= start && item.top <= end;
    });
  }, [itemData, scrollTop, containerHeight, overscan, estimatedItemHeight, shouldVirtualize]);

  // Actualizar altura medida de un mensaje
  const updateItemHeight = useCallback((messageId: string, height: number) => {
    setMeasuredHeights(prev => {
      const newMap = new Map(prev);
      newMap.set(messageId, height);
      return newMap;
    });
  }, []);

  // Handler de scroll
  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
  }, []);

  // Calcular offset para elementos antes del viewport
  const offsetY = useMemo(() => {
    if (!shouldVirtualize || visibleItems.length === 0) {
      return 0;
    }
    
    return visibleItems[0].top;
  }, [visibleItems, shouldVirtualize]);

  // Limpiar alturas medidas cuando cambien los mensajes
  useEffect(() => {
    const currentMessageIds = new Set(messages.map(m => m.id));
    
    setMeasuredHeights(prev => {
      const newMap = new Map();
      
      for (const [id, height] of prev) {
        if (currentMessageIds.has(id)) {
          newMap.set(id, height);
        }
      }
      
      return newMap;
    });
  }, [messages]);

  return {
    shouldVirtualize,
    visibleItems,
    totalHeight,
    offsetY,
    updateItemHeight,
    handleScroll,
    containerHeight,
  };
};