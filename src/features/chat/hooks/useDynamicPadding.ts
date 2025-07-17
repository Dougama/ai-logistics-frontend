import { useEffect, useRef, useCallback } from 'react';

interface UseDynamicPaddingOptions {
  enabled?: boolean;
  extraPadding?: number;
  debug?: boolean;
}

/**
 * Hook para gestionar el padding dinámico del contenedor de mensajes
 * basado en la altura real del input fijo
 */
export const useDynamicPadding = (
  messagesContainerRef: React.RefObject<HTMLDivElement>,
  options: UseDynamicPaddingOptions = {}
) => {
  const {
    enabled = true,
    extraPadding = 20,
    debug = false
  } = options;

  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const lastPaddingRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Mover useCallback fuera del useEffect
  const updatePadding = useCallback(() => {
    const messagesContainer = messagesContainerRef.current;
    const inputElement = document.querySelector('.message-input-fixed') as HTMLElement;
    
    if (!messagesContainer || !inputElement) return;

    const inputHeight = inputElement.offsetHeight;
    const newPadding = inputHeight + extraPadding;
    
    // Solo actualizar si hay cambio significativo para evitar re-renders innecesarios
    if (Math.abs(newPadding - lastPaddingRef.current) > 5) {
      messagesContainer.style.paddingBottom = `${newPadding}px`;
      lastPaddingRef.current = newPadding;
      
      if (debug) {
        console.log('🔄 Dynamic padding updated:', {
          inputHeight,
          extraPadding,
          totalPadding: newPadding
        });
      }
    }
  }, [extraPadding, debug, messagesContainerRef]);

  const debouncedUpdatePadding = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(updatePadding, 100);
  }, [updatePadding]);

  useEffect(() => {
    if (!enabled || !messagesContainerRef.current) return;

    // Actualización inicial
    updatePadding();

    // Observar cambios en el tamaño del input
    const inputElement = document.querySelector('.message-input-fixed') as HTMLElement;
    if (inputElement && window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(() => {
        debouncedUpdatePadding();
      });
      resizeObserverRef.current.observe(inputElement);
    }

    // Fallback para navegadores sin ResizeObserver
    const handleResize = () => {
      debouncedUpdatePadding();
    };

    window.addEventListener('resize', handleResize);
    
    // Actualización adicional después de un breve delay (para asegurar renderizado completo)
    const timeoutId = setTimeout(updatePadding, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [enabled, messagesContainerRef, updatePadding, debouncedUpdatePadding]);

  return {
    updatePadding: () => {
      const messagesContainer = messagesContainerRef.current;
      const inputElement = document.querySelector('.message-input-fixed') as HTMLElement;
      
      if (messagesContainer && inputElement) {
        const inputHeight = inputElement.offsetHeight;
        const newPadding = inputHeight + extraPadding;
        messagesContainer.style.paddingBottom = `${newPadding}px`;
        lastPaddingRef.current = newPadding;
      }
    }
  };
};