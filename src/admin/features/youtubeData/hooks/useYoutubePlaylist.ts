import { useQuery } from "@tanstack/react-query";
import { youtubeService } from "../services/youtube.service";

const useYoutubePlaylist = (id?: string) => {
   return useQuery({
      queryKey: ['YoutubePlaylist', id],
      queryFn: () => youtubeService.getPlaylists(id!),
      enabled: !!id
   })
}

const useYoutubePlaylistItems = (playlistId?: string) => {
   return useQuery({
      queryKey: ['YoutubePlaylistItems', playlistId],
      queryFn: () => youtubeService.getAllPlaylistVideos(playlistId!),
      enabled: !!playlistId,
      retry: 1,
      refetchOnWindowFocus: false,
   })
}

export const useYoutubeData = (playlistId?: string) => {
   const playlist = useYoutubePlaylist(playlistId);
   const playlistItems = useYoutubePlaylistItems(playlistId);

   return {
      playlist,
      playlistItems
   }
}