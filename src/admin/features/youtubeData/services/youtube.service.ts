import youtubeApi, {YOUTUBE_API_BASE_URL, YOUTUBE_API_ENDPOINTS} from "@/admin/core/config/youtubeAPIConfig";
import { type YoutubePlaylistResponse } from "../schemas/youtube.playlist.schema";
import { YoutubePlaylistResponseItemSchema } from "../schemas/youtube.playlistItems.schema";

export const youtubeService = {
   getPlaylists: async (id: string): Promise<YoutubePlaylistResponse> => {
      const { data } = await youtubeApi.get(`${YOUTUBE_API_BASE_URL}${YOUTUBE_API_ENDPOINTS.PLAYLIST}`, {
         params: {
            part: 'snippet',
            id,
         },
      });
      return data;
   },

   getPlaylistPage: async (playlistId: string, pageToken?: string) => {
      const response = await youtubeApi.get(`${YOUTUBE_API_BASE_URL}${YOUTUBE_API_ENDPOINTS.PLAYLIST_ITEMS}`, {
      params: {
         playlistId,
         part: 'snippet',
         maxResults: 50,
         pageToken: pageToken
      }
      });
      
      // Validamos la respuesta con Zod (opcional pero recomendado)
      return YoutubePlaylistResponseItemSchema.parse(response.data);
   },
   
   // 2. LA FUNCIÓN MAESTRA (Esta es la que importas)
   getAllPlaylistVideos: async (playlistId: string): Promise<string[]> => {
      let allVideos: string[] = [];
      let nextPageToken: string | undefined = undefined;
      let keepFetching = true;
   
      try {
      while (keepFetching) {
         // Pedimos la página actual
         const data = await youtubeService.getPlaylistPage(playlistId, nextPageToken);
         
         // Acumulamos los videos
         allVideos = [...allVideos, ...data.items.map(item => item.snippet.resourceId.videoId)];
         
         // Verificamos si hay otra página
         nextPageToken = data.nextPageToken;
   
         // Si no hay token, se acabó la playlist
         if (!nextPageToken) {
            keepFetching = false;
         }
      }
   
      return allVideos; // Devolvemos TODOS los videos juntos
   
      } catch (error) {
      console.error("Error trayendo la playlist completa", error);
      throw error;
      }
   }
};