/**
 * Formats TMDB relative image paths to full URLs.
 * Handles fallbacks if the path is invalid or missing.
 */
export const getImageUrl = (
  path: string | null | undefined,
  size: 'poster' | 'backdrop' = 'poster'
): string => {
  if (!path) {
    // Return high quality Unsplash placeholders as fallback
    return size === 'backdrop'
      ? 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1200&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';
  }

  // If path is already a full URL, return it directly
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // TMDB base image URL
  const baseUrl = 'https://image.tmdb.org/t/p';
  const width = size === 'backdrop' ? 'original' : 'w500';

  return `${baseUrl}/${width}${path}`;
};
