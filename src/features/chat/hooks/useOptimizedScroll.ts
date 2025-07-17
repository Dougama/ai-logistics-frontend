// src/features/chat/hooks/useOptimizedScroll.ts
import { useEffect, useRef, useCallback } from 'react';

interface UseOptimizedScrollOptions {
  /** Debounce tiempo en ms para scroll events */
  debounceTime?: number;
  /** Activar scroll suave */
  smoothScroll?: boolean;
  /** Callback cuando se llega al final */
  onScrollEnd?: () => void;
  /** Callback cuando se llega al inicio */
  onScrollStart?: () => void;
}

export const useOptimizedScroll = (options: UseOptimizedScrollOptions = {}) => {
  const {
    debounceTime = 100,
    smoothScroll = true,
    onScrollEnd,
    onScrollStart,
  } = options;

  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isScrollingRef = useRef(false);

  // Scroll suave al final
  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    
    if (smoothScroll) {
      // Usar requestAnimationFrame para scroll suave optimizado
      const scrollToEnd = () => {
        element.scrollTop = element.scrollHeight;
      };
      
      requestAnimationFrame(scrollToEnd);
    } else {
      element.scrollTop = element.scrollHeight;
    }
  }, [smoothScroll]);

  // Scroll suave al inicio
  const scrollToTop = useCallback(() => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    
    if (smoothScroll) {
      element.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      element.scrollTop = 0;
    }
  }, [smoothScroll]);

  // Detectar si está al final
  const isAtBottom = useCallback(() => {
    if (!scrollRef.current) return false;
    
    const element = scrollRef.current;
    const threshold = 50; // 50px de threshold
    
    return element.scrollTop + element.clientHeight >= 
           element.scrollHeight - threshold;
  }, []);

  // Detectar si está al inicio
  const isAtTop = useCallback(() => {
    if (!scrollRef.current) return false;
    
    const element = scrollRef.current;
    const threshold = 50; // 50px de threshold
    
    return element.scrollTop <= threshold;
  }, []);

  // Handler de scroll con debounce
  const handleScroll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isAtBottom() && onScrollEnd) {
        onScrollEnd();
      }
      
      if (isAtTop() && onScrollStart) {
        onScrollStart();
      }
      
      isScrollingRef.current = false;
    }, debounceTime);

    isScrollingRef.current = true;
  }, [debounceTime, isAtBottom, isAtTop, onScrollEnd, onScrollStart]);

  // Configurar event listeners
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // Configurar scroll behavior
    element.style.scrollBehavior = smoothScroll ? 'smooth' : 'auto';
    
    // Prevenir bounce en iOS
    element.style.overscrollBehavior = 'contain';
    (element.style as any).WebkitOverflowScrolling = 'touch';

    // Agregar event listener
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll, smoothScroll]);

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
    isAtBottom,
    isAtTop,
    isScrolling: isScrollingRef.current,
  };
};