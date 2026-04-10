import { useEffect, useRef } from 'react';

function usePageTitle(title: string) {
  const originalTitle = useRef(document.title);

  useEffect(() => {
    document.title = `${title} | Virtual+`;

    return () => {
      document.title = originalTitle.current;
    };
  }, [title]);
}

export default usePageTitle;