import api, {
   API_BASE_URL,
   API_ENDPOINTS,
} from '@/admin/core/config/apiConfig';
import { type Stats, StatsSchema } from '../schemas/stats.schema';

export const statsService = {
   getStats: async (): Promise<Stats> => {
      const { data } = await api.get(`${API_BASE_URL}${API_ENDPOINTS.STATS}`);
      return StatsSchema.parse(data);
   },
};
