import { useEffect } from 'react';

function usePageTitle(title: string) {
   useEffect(() => {
      const originalTitle = document.title;
      document.title = title;
   
      return () => {
         document.title = originalTitle;
      }
   }, [title]);
}
export default usePageTitle;