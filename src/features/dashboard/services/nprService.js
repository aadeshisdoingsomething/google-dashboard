/**
 * Service to fetch and parse NPR News Now RSS feed.
 * Returns a normalized playlist of audio tracks.
 */
export const fetchNprFeed = async () => {
  // 1. Cache Busting: Unique timestamp to bypass Browser & Proxy cache
  const timestamp = new Date().getTime();
  const RSS_URL = `https://feeds.npr.org/500005/podcast.xml?_t=${timestamp}`;
  
  // 2. Proxy: Use corsproxy.io to bypass CORS restrictions
  const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(RSS_URL)}`;

  // 3. Fetch with headers to prevent caching
  const res = await fetch(proxyUrl, {
    cache: 'no-store',
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
  });

  if (!res.ok) throw new Error("Network response was not ok");
  
  const textData = await res.text();
  
  // 4. Parse XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(textData, "text/xml");
  const items = xmlDoc.querySelectorAll('item');
  
  const playlist = [];
  
  items.forEach(item => {
    const title = item.querySelector('title')?.textContent;
    const pubDate = item.querySelector('pubDate')?.textContent;
    const enclosure = item.querySelector('enclosure');
    const audioUrl = enclosure ? enclosure.getAttribute('url') : null;
    
    // Validate we actually have audio
    if (audioUrl) {
      playlist.push({ 
        title, 
        pubDate, 
        audioUrl,
        // Optional: Add metadata here if needed later (e.g. duration from RSS)
        source: 'NPR' 
      });
    }
  });

  if (playlist.length === 0) throw new Error("No audio found in feed");
  
  return playlist;
};