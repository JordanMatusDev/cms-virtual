import { useEffect } from 'react';

export function useTrapFocus(modalRef: React.RefObject<HTMLElement | null>, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Función auxiliar para buscar elementos interactivos
    const getFocusableEls = (node: HTMLElement) => {
      const focusableSelectors = [
        'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
        'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
      ];
      return Array.from(node.querySelectorAll(focusableSelectors.join(','))) as HTMLElement[];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const node = modalRef.current;
      // LA MAGIA: Si el modal ya no está en pantalla (Hook Fantasma), ignorar evento
      if (!node || !document.contains(node)) return;

      const focusable = getFocusableEls(node);
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

    document.addEventListener('keydown', handleKeyDown);

    // Retrasamos un pelín el auto-focus inicial para que React termine de armar el DOM
    const timer = setTimeout(() => {
      const node = modalRef.current;
      if (node) {
        node.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalRef, isOpen]);

  return modalRef;
}