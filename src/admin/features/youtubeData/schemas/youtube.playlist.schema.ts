import { z } from "zod";


export const LocalizedSchema = z.object({
   "title": z.string(),
   "description": z.string(),
});
export type Localized = z.infer<typeof LocalizedSchema>;


export const ThumbnailSchema = z.object({
   "url": z.string(),
   "width": z.number(),
   "height": z.number(),
});
export type Thumbnail = z.infer<typeof ThumbnailSchema>;


export const PageInfoSchema = z.object({
   "totalResults": z.number(),
   "resultsPerPage": z.number(),
});
export type PageInfo = z.infer<typeof PageInfoSchema>;


export const ThumbnailsSchema = z.object({
   "default": ThumbnailSchema,
   "medium": ThumbnailSchema,
   "high": ThumbnailSchema,
   "standard": ThumbnailSchema,
   "maxres": ThumbnailSchema,
});
export type Thumbnails = z.infer<typeof ThumbnailsSchema>;


export const SnippetSchema = z.object({
   "publishedAt": z.coerce.date(),
   "channelId": z.string(),
   "title": z.string(),
   "description": z.string(),
   "thumbnails": ThumbnailsSchema,
   "channelTitle": z.string(),
   "localized": LocalizedSchema,
});
export type Snippet = z.infer<typeof SnippetSchema>;


export const ItemSchema = z.object({
   "kind": z.string(),
   "etag": z.string(),
   "id": z.string(),
   "snippet": SnippetSchema,
});
export type Item = z.infer<typeof ItemSchema>;


export const YoutubePlaylistResponseSchema = z.object({
   "kind": z.string(),
   "etag": z.string(),
   "pageInfo": PageInfoSchema,
   "items": z.array(ItemSchema),
});
export type YoutubePlaylistResponse = z.infer<typeof YoutubePlaylistResponseSchema>;
