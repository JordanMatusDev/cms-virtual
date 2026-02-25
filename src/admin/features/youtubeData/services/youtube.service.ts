import youtubeApi, { YOUTUBE_API_BASE_URL, YOUTUBE_API_ENDPOINTS } from "@/admin/core/config/youtubeAPIConfig";
import { type YoutubePlaylistResponse } from "../schemas/youtube.playlist.schema";
import { YoutubePlaylistResponseItemSchema } from "../schemas/youtube.playlistItems.schema";
import { type VideoDetail } from "@/admin/types/videoDetails"; 
import { parseISODuration } from "@/admin/utils/youtubeUtils";

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
      return YoutubePlaylistResponseItemSchema.parse(response.data);
   },
   
   getAllPlaylistVideos: async (playlistId: string): Promise<string[]> => {
      let allVideos: string[] = [];
      let nextPageToken: string | undefined = undefined;
      let keepFetching = true;
   
      try {
         while (keepFetching) {
            const data = await youtubeService.getPlaylistPage(playlistId, nextPageToken);
            allVideos = [...allVideos, ...data.items.map(item => item.snippet.resourceId.videoId)];
            nextPageToken = data.nextPageToken;
      
            if (!nextPageToken) {
               keepFetching = false;
            }
         }
         return allVideos;
      } catch (error) {
         console.error("Error trayendo la playlist completa", error);
         throw error;
      }
   },

   getVideoDetails: async (videoIds: string[]): Promise<VideoDetail[]> => {
      if (!videoIds || videoIds.length === 0) return [];

      let allVideoDetails: VideoDetail[] = [];
      const chunkSize = 50;
      const chunks = [];
      
      for (let i = 0; i < videoIds.length; i += chunkSize) {
         chunks.push(videoIds.slice(i, i + chunkSize));
      }

      try {
         for (const chunk of chunks) {
            // Asegúrate de que este endpoint sea el correcto ('/videos')
            const { data } = await youtubeApi.get(`${YOUTUBE_API_BASE_URL}/videos`, {
               params: {
                  part: 'snippet,contentDetails', 
                  id: chunk.join(','),            
               }
            });

            const formattedDetails: VideoDetail[] = data.items.map((item: any) => ({
               id: item.id,
               title: item.snippet.title,
               thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
               durationMinutes: parseISODuration(item.contentDetails.duration)
            }));

            allVideoDetails = [...allVideoDetails, ...formattedDetails];
         }

         return allVideoDetails;
      } catch (error) {
         console.error("Error trayendo los detalles de los videos", error);
         throw error;
      }
   }
};