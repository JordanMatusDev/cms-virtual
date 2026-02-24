export const parseISODuration = (isoDuration: string): number => {

   const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
   // Agregamos un fallback (|| "") por si YouTube manda undefined y evitar que el .match truene
   const matches = (isoDuration || "").match(regex);

   if (!matches) return 0;

   const hours = parseInt(matches[1] || '0', 10);
   const minutes = parseInt(matches[2] || '0', 10);
   const seconds = parseInt(matches[3] || '0', 10);

   return (hours * 60) + minutes + (seconds > 30 ? 1 : 0);
};

export const extractPlaylistId = (input: string): string | null => {
   const regExp = /[?&]list=([^#\&\?]+)/;
   const match = input.match(regExp);
   return match ? match[1] : input;
};