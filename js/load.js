chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Message error:', chrome.runtime.lastError.message);
    document.getElementById('daily-text').textContent =
      'Failed to fetch data. Please try again later.';
    return;
  }

  if (response.success) {
    try {
      // Assuming response.data is a JSON string, try parsing it
      const parsedData = JSON.parse(response.data);
      const parsedContent = parsedData.items[0].content;

      if (parsedContent) {
        // Add prefix to all hrefs in the parsedContent
        const prefix = "https://wol.jw.org";

        // Parse the content into a DOM object
        const parser = new DOMParser();
        const doc = parser.parseFromString(parsedContent, "text/html");

        // Modify all href attributes
        doc.querySelectorAll("a[href]").forEach(anchor => {
          const href = anchor.getAttribute("href");
          if (href.startsWith("/")) { // Only modify if it starts with "/"
            anchor.setAttribute("href", prefix + href);
          }
        });

        // Serialize the updated content back to HTML
        const updatedContent = doc.body.innerHTML;

        // Display the updated content in the DOM
        document.getElementById('daily-text').innerHTML = updatedContent;
      } else {
        document.getElementById('daily-text').textContent = 'No content available.';
      }
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
      document.getElementById('daily-text').textContent =
        'Failed to parse data. Please check console for details.';
    }
  } else {
    console.error('Fetch error:', response.error);
    document.getElementById('daily-text').textContent =
      'Error loading daily text. Please check console for details.';
  }
});
