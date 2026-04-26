const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export async function getLocationImage(locationName) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${locationName}&per_page=1&client_id=${ACCESS_KEY}`
  );
  const data = await response.json();
  
  if (data.results && data.results.length > 0) {
    return data.results[0].urls.regular;
  }
  
  // Fallback image if nothing found
  return 'https://images.unsplash.com/photo-1488085061387-422e29b40080';
}