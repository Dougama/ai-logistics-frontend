import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./routes";

function App() {
  useEffect(() => {
    // Solución mejorada para iOS bounce y scroll optimizado
    let startY = 0;
    let startX = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].pageY;
      startX = e.touches[0].pageX;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // No aplicar anti-bounce si estamos dentro de un modal o área de chat
      const isInModal = target.closest(".modal, [role='dialog']");
      const isInChatMessages = target.closest(".chat-window__messages");
      
      if (isInModal || isInChatMessages) {
        // Permitir scroll normal en modales y área de mensajes
        return;
      }

      const y = e.touches[0].pageY;
      const x = e.touches[0].pageX;
      
      // Detectar dirección de scroll
      if (!isScrolling) {
        const deltaY = Math.abs(y - startY);
        const deltaX = Math.abs(x - startX);
        
        // Solo prevenir si es scroll vertical
        if (deltaY > deltaX) {
          isScrolling = true;
        } else {
          return; // Permitir scroll horizontal
        }
      }

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Si estamos en el top y tratamos de scrollear hacia arriba
      if (scrollTop === 0 && y > startY) {
        e.preventDefault();
      }

      // Si estamos en el bottom y tratamos de scrollear hacia abajo
      if (scrollTop + clientHeight >= scrollHeight && y < startY) {
        e.preventDefault();
      }
    };

    // Prevenir bounce en toda la página
    const preventBounce = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const isInScrollableArea = target.closest(".chat-window__messages, .modal, [role='dialog']");
      
      if (!isInScrollableArea) {
        e.preventDefault();
      }
    };

    // Aplicar estilos CSS para prevenir bounce
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    // Agregar event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { 
      passive: false 
    });
    document.addEventListener("touchend", () => {
      isScrolling = false;
    }, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, []);

  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
