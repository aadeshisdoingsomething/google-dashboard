// Add 'feedUrl' parameter
export const fetchNprFeed = async (feedUrl) => {
  const timestamp = new Date().getTime();
  // Append timestamp to the passed URL
  const uniqueUrl = `${feedUrl}?_t=${timestamp}`;
  
  const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(uniqueUrl)}`;

  const res = await fetch(proxyUrl, {
    cache: 'no-store',
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
  });

  if (!res.ok) throw new Error("Network response was not ok");
  
  // ... rest of XML parsing logic remains the same ...
  const textData = await res.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(textData, "text/xml");
  const items = xmlDoc.querySelectorAll('item');
  
  const playlist = [];
  
  items.forEach(item => {
    const title = item.querySelector('title')?.textContent;
    const pubDate = item.querySelector('pubDate')?.textContent;
    const enclosure = item.querySelector('enclosure');
    const audioUrl = enclosure ? enclosure.getAttribute('url') : null;
    
    if (audioUrl) {
      playlist.push({ title, pubDate, audioUrl, source: 'NPR' });
    }
  });

  if (playlist.length === 0) throw new Error("No audio found in feed");
  
  return playlist;
};