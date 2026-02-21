// Add 'feedUrl' parameter
export const fetchNprFeed = async (feedUrl) => {
  const timestamp = new Date().getTime();
  // Append timestamp to the passed URL
  const uniqueUrl = `${feedUrl}?_t=${timestamp}`;

  const proxyUrl = `/api/npr?url=${encodeURIComponent(uniqueUrl)}`;

  const res = await fetch(proxyUrl, {
    cache: 'no-store'
  });

  if (!res.ok) throw new Error("Network response was not ok");

  // ... rest of XML parsing logic remains the same ...
  const textData = await res.text();

  if (textData.trim().toLowerCase().startsWith("<!doctype html>")) {
    throw new Error("Proxy error: Received Vite HTML instead of RSS XML. Ensure proxy is running or access via localhost:8788!");
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(textData, "text/xml");

  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) throw new Error("Failed to parse NPR XML Feed: " + parseError.textContent);

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