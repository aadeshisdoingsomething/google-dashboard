export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const feedUrl = url.searchParams.get("url");

    if (!feedUrl) {
        return new Response("Missing URL parameter", { status: 400 });
    }

    // Fetch from the actual NPR feed
    const response = await fetch(feedUrl, {
        headers: {
            "User-Agent": "My-RSS-Reader/1.0"
        }
    });

    // Create a new Headers object from the original response
    const proxyHeaders = new Headers(response.headers);

    // Set our allowed Origin
    proxyHeaders.set("Access-Control-Allow-Origin", "*");

    // CRITICAL FIX: The Cloudflare worker automatically decompresses the upstream response (e.g. gzip)
    // when we call `response.text()` or just pass `response.body`.
    // If we leave the `Content-Encoding: gzip` header intact, the browser will try to
    // decompress an already decompressed text body, resulting in garbled text and a 0-item DOMParser failure.
    proxyHeaders.delete("Content-Encoding");

    // Re-create the response with the clean headers
    const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: proxyHeaders
    });

    return newResponse;
}
