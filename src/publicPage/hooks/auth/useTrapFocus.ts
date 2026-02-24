import { useEffect} from 'react';

/**
 * Hook para atrapar el tab y mantener el foco dentro del modal.
 * Recibe un ref al contenedor principal del modal.
 */
export function useTrapFocus(modalRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
      'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ];
    const getFocusable = () => Array.from(node.querySelectorAll(focusableSelectors.join(','))) as HTMLElement[];

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

    node.addEventListener('keydown', handleKeyDown);
    return () => node.removeEventListener('keydown', handleKeyDown);
  }, [modalRef]);

  // Devuelve el ref para usarlo en el modal
  return modalRef;
}
