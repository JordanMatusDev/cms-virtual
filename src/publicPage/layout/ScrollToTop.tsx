import { useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const maxAttempts = 20; // 20 x 50ms = 1s
      const interval = setInterval(() => {
        const target = document.getElementById(id);
        attempts++;
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
