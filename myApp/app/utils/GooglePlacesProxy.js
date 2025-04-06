const cache = new Map();
const RATE_LIMIT_DELAY = 200; // Delay in milliseconds between API calls
let lastRequestTime = 0;

const GooglePlacesProxy = {
  async fetchImage(photoReference, apiKey) {
    if (!photoReference) return null;

    // Check cache first
    if (cache.has(photoReference)) {
      return cache.get(photoReference);
    }

    // Enforce rate-limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise((resolve) =>
        setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }

    // Build the URL
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

    try {
      // Simulate fetching the image URL (lazy loading)
      lastRequestTime = Date.now();
      cache.set(photoReference, imageUrl); // Cache the result
      return imageUrl;
    } catch (error) {
      console.error("Error fetching image from Google Places API:", error);
      return null;
    }
  },
};

export default GooglePlacesProxy;
