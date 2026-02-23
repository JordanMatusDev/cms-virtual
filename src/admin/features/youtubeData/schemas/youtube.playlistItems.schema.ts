import { z } from "zod";

const ImageDetailsSchema = z.object({
   url: z.string().url(),
   width: z.number(),
   height: z.number(),
});

const ThumbnailsSchema = z.object({
   default: ImageDetailsSchema.optional(),
   medium: ImageDetailsSchema.optional(),
   high: ImageDetailsSchema.optional(),
   standard: ImageDetailsSchema.optional(),
   maxres: ImageDetailsSchema.optional(),
});

const ResourceIdSchema = z.object({
   kind: z.string(),
   videoId: z.string(),
});

const SnippetSchema = z.object({
   publishedAt: z.coerce.date(),
   channelId: z.string(),
   title: z.string(),
   description: z.string(),
   thumbnails: ThumbnailsSchema,
   channelTitle: z.string(),
   playlistId: z.string(),
   position: z.number(),
   resourceId: ResourceIdSchema,
   videoOwnerChannelTitle: z.string().optional(),
   videoOwnerChannelId: z.string().optional(),
});

export const YoutubePlaylistItemSchema = z.object({
   kind: z.string(),
   etag: z.string(),
   id: z.string(),
   snippet: SnippetSchema,
});

export const YoutubePlaylistResponseItemSchema = z.object({
   kind: z.string(),
   etag: z.string(),
   nextPageToken: z.string().optional(),
   prevPageToken: z.string().optional(),
   items: z.array(YoutubePlaylistItemSchema),
   pageInfo: z.object({
      totalResults: z.number(),
      resultsPerPage: z.number(),
   }),
});

export type YoutubePlaylistItem = z.infer<typeof YoutubePlaylistItemSchema>;
export type YoutubePlaylistItemResponse = z.infer<typeof YoutubePlaylistResponseItemSchema>;