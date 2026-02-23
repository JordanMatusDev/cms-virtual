// src/hooks/header/useClickOutside.ts
import { useEffect, useRef } from 'react';

export function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent | TouchEvent) => void) {
  // 1. Guardamos la función en una referencia para no perderla
  const savedHandler = useRef(handler);

  // 2. Si la función cambia, solo actualizamos la referencia, 
  // pero NO reiniciamos el event listener principal
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Si el ref no existe o si el clic ocurrió ADENTRO del elemento, no hacemos nada
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      // Si el clic fue AFUERA, ejecutamos el handler guardado
      savedHandler.current(event);
    };

    // Escuchamos clics de mouse y toques en pantallas táctiles (móviles)
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]); // <--- AHORA EL SECRETO ESTÁ AQUÍ: Solo dependemos del 'ref'
}