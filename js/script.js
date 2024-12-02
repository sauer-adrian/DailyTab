const API_KEY = 'DMjYMYhHUDLJuCAUxJmSYEflRUVtf6R5w3qS4UbvHWjsIsgbg1NMKae7';
const CACHE_KEY = 'backgroundImages';
const FALLBACK_IMAGE_URL = 'https://images.pexels.com/photos/12734294/pexels-photo-12734294.jpeg';

// Function to fetch a new image and store it in localStorage
async function fetchAndStoreImage(page = 1, resolution = 'large') {
  try {
    const response = await fetch(`https://api.pexels.com/v1/collections/0drf1np?per_page=1&page=${page}`, {
      headers: {
        Authorization: API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Pexels API');
    }

    const data = await response.json();

    if (data.media && data.media.length > 0) {
      const image = data.media[0];
      const imageUrl = image.src[resolution] || image.src['large'];

      // Store the image URL in localStorage
      let imageCache = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
      imageCache.push(imageUrl);

      // Limit the cache size to 10 images
      if (imageCache.length > 10) {
        imageCache.shift(); // Remove the oldest image
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(imageCache));
    }
  } catch (error) {
    console.error('Error fetching and storing the image:', error);
  }
}

// Function to set the background image from the cache
function setBackgroundFromCache() {
  const imageCache = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
  if (imageCache.length > 0) {
    const randomIndex = Math.floor(Math.random() * imageCache.length);
    const imageUrl = imageCache[randomIndex];
    document.body.style.backgroundImage = `url(${imageUrl})`;
  } else {
    // Use fallback image if no images are in the cache
    console.info('No images in cache. Using fallback image.');
    document.body.style.backgroundImage = `url(${FALLBACK_IMAGE_URL})`;
  }
}

// Initialize the background system
async function initBackgroundSystem() {
  // Set the background from the cache or fallback
  setBackgroundFromCache();

  // Fetch and store a new image in the background
  const randomPage = Math.floor(Math.random() * 13) + 1; // Random page between 1 and 12
  await fetchAndStoreImage(randomPage, 'original');
}

// Call the initialization function
initBackgroundSystem();
