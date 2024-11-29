chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Fetch data function with improved error handling
async function fetchData(url) {
  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
}

// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Construct the URL with the current date
    const url = `https://wol.jw.org/wol/dt/r10/lp-x/${year}/${month}/${day}`;

    fetchData(url)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // Keep the message channel open for async response
  }
});
