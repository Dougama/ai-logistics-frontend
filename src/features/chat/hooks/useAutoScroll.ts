// src/features/chat/hooks/useAutoScroll.ts
import { useRef, useEffect, useCallback, useState } from 'react';

interface UseAutoScrollOptions {
  /** Activar auto-scroll automático */
  enabled?: boolean;
  /** Delay antes del scroll en ms */
  delay?: number;
  /** Comportamiento del scroll */
  behavior?: 'smooth' | 'auto';
  /** Umbral de distancia del final para considerar "cerca del final" */
  threshold?: number;
  /** Activar logs de debug */
  debug?: boolean;
}

export const useAutoScroll = (options: UseAutoScrollOptions = {}) => {
  const {
    enabled = true,
    delay = 100,
    behavior = 'smooth',
    threshold = 100,
    debug = false,
  } = options;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomElementRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTopRef = useRef(0);

  // Detectar si el usuario está cerca del final
  const checkIfNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return false;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceFromBottom <= threshold;
    
    if (debug) {
      console.log('🔍 Auto-scroll check:', {
        scrollTop,
        scrollHeight,
        clientHeight,
        distanceFromBottom,
        nearBottom,
        threshold
      });
    }
    
    setIsNearBottom(nearBottom);
    return nearBottom;
  }, [threshold, debug]);

  // Detectar scroll del usuario
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const currentScrollTop = scrollContainerRef.current.scrollTop;
    
    // Detectar si el usuario está scrolleando manualmente
    if (Math.abs(currentScrollTop - lastScrollTopRef.current) > 1) {
      setIsUserScrolling(true);
      
      // Limpiar timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Después de 1 segundo sin scroll, considerar que terminó
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
        checkIfNearBottom();
      }, 1000);
    }
    
    lastScrollTopRef.current = currentScrollTop;
    checkIfNearBottom();
  }, [checkIfNearBottom]);

  // Hacer scroll al final con buffer adicional para garantizar visibilidad completa
  const scrollToBottom = useCallback((force = false) => {
    if (!enabled && !force) {
      if (debug) console.log('❌ Auto-scroll deshabilitado');
      return;
    }

    if (!scrollContainerRef.current || !bottomElementRef.current) {
      if (debug) console.log('❌ Referencias no disponibles para scroll');
      return;
    }

    // Si el usuario está scrolleando manualmente y no está cerca del final, no hacer auto-scroll
    if (isUserScrolling && !isNearBottom && !force) {
      if (debug) console.log('❌ Usuario scrolleando manualmente, evitando auto-scroll');
      return;
    }

    if (debug) {
      console.log('🚀 Ejecutando auto-scroll', {
        force,
        isUserScrolling,
        isNearBottom,
        behavior,
        delay
      });
    }

    // Usar RAF + timeout para mejor rendimiento
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          
          // MÉTODO MEJORADO: Scroll al final absoluto + buffer de seguridad
          const maxScrollTop = container.scrollHeight - container.clientHeight;
          const bufferPx = 50; // Buffer adicional para garantizar visibilidad completa
          const targetScrollTop = maxScrollTop + bufferPx;
          
          if (debug) {
            console.log('📊 Scroll completo con buffer:', {
              scrollHeight: container.scrollHeight,
              clientHeight: container.clientHeight,
              maxScrollTop,
              bufferPx,
              targetScrollTop,
              currentScrollTop: container.scrollTop
            });
          }
          
          // Aplicar scroll con animación suave
          container.scrollTo({
            top: targetScrollTop,
            behavior
          });
          
          // Fallback: usar scrollIntoView si scrollTo no funciona
          setTimeout(() => {
            if (bottomElementRef.current && Math.abs(container.scrollTop - targetScrollTop) > 10) {
              if (debug) console.log('🔧 Fallback: usando scrollIntoView');
              bottomElementRef.current.scrollIntoView({
                behavior,
                block: 'end',
                inline: 'nearest'
              });
              
              // Buffer adicional después del scrollIntoView
              setTimeout(() => {
                if (scrollContainerRef.current) {
                  const finalMaxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
                  scrollContainerRef.current.scrollTop = finalMaxScroll + 20;
                }
              }, 100);
            }
          }, behavior === 'smooth' ? 500 : 50);
        }
      }, delay);
    });
  }, [enabled, delay, behavior, isUserScrolling, isNearBottom, debug]);

  // Scroll inmediato con buffer para garantizar visibilidad completa (sin delay, para carga inicial)
  const scrollToBottomImmediate = useCallback(() => {
    if (!scrollContainerRef.current || !bottomElementRef.current) return;

    if (debug) console.log('⚡ Scroll inmediato con buffer');

    // Scroll inmediato sin animación para carga inicial
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        
        // Método directo: ir al final absoluto + buffer
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        const bufferPx = 50;
        
        if (debug) {
          console.log('⚡ Scroll inmediato datos:', {
            scrollHeight: container.scrollHeight,
            clientHeight: container.clientHeight,
            maxScrollTop,
            targetScroll: maxScrollTop + bufferPx
          });
        }
        
        // Aplicar scroll inmediato
        container.scrollTop = maxScrollTop + bufferPx;
        
        // Doble verificación después de un tick
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const newMaxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
            scrollContainerRef.current.scrollTop = newMaxScroll + 30;
          }
        }, 0);
      }
    });
  }, [debug]);

  // Configurar event listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Verificar posición inicial
    checkIfNearBottom();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, checkIfNearBottom]);

  return {
    scrollContainerRef,
    bottomElementRef,
    scrollToBottom,
    scrollToBottomImmediate,
    isNearBottom,
    isUserScrolling,
    checkIfNearBottom,
  };
};