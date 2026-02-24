import { useEffect} from 'react';

/**
 * Hook para atrapar el tab y mantener el foco dentro del modal.
 * Recibe un ref al contenedor principal del modal.
 */
export function useTrapFocus(modalRef: React.RefObject<HTMLElement | null>, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;
    const node = modalRef.current;
    if (!node) return;

    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
      'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ];
    const getFocusable = () => Array.from(node.querySelectorAll(focusableSelectors.join(','))) as HTMLElement[];

    // Enfocar el primer elemento interactivo al abrir el modal
    const focusableEls = getFocusable();
    if (focusableEls.length > 0) {
      setTimeout(() => {
        focusableEls[0].focus();
      }, 0);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (active === first || !node.contains(active)) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (active === last || !node.contains(active)) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    // Adjuntar el evento al document para mayor robustez
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalRef, isOpen]);

  // Devuelve el ref para usarlo en el modal
  return modalRef;
}
