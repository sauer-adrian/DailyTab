//Yes, this is my API key. Please use your own. I was too lazy to set up something like a .env file.
const API_KEY = 'DMjYMYhHUDLJuCAUxJmSYEflRUVtf6R5w3qS4UbvHWjsIsgbg1NMKae7';

// Function to fetch and set a background image from a specific collection and page
async function setBackgroundImage(page = 1, resolution = 'large') {
  try {
    // Pexels API endpoint with collection and pagination
    const response = await fetch(`https://api.pexels.com/v1/collections/0drf1np?per_page=1&page=${page}`, {
      headers: {
        Authorization: API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Pexels API');
    }

    const data = await response.json();

    // Ensure we have at least one result
    if (data.media && data.media.length > 0) {
      // Choose the first image in the media array (since per_page=1)
      const image = data.media[0];
      
      // Access the image URL based on the requested resolution
      const imageUrl = image.src[resolution] || image.src['large'];  // Fallback to 'large' if the requested resolution is unavailable

      // Set the image as the body's background
      document.body.style.backgroundImage = `url(${imageUrl})`;
    } else {
      console.error('No images found for this collection on page', page);
    }
  } catch (error) {
    console.error('Error fetching the background image:', error);
  }
}
// Call the function with a specific page and preferred resolution
setBackgroundImage(Math.floor(Math.random() * 12) + 1, 'landscape'); // You can change the page number (e.g., 3 or 5)
