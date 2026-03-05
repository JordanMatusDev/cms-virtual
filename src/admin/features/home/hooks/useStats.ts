import { useQuery } from '@tanstack/react-query';
import { statsService } from '../services/stats.service';

export const useGetStats = () => {
   return useQuery({
      queryKey: ['Stats'],
      queryFn: statsService.getStats,
   });
};
