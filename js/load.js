chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Message error:', chrome.runtime.lastError.message);
    document.getElementById('daily-text').textContent =
      'Failed to fetch data. Please try again later.';
    return;
  }

  if (response.success) {
    try {
      const parsedData = JSON.parse(response.data);
      const parsedContent = parsedData.items[0].content;

      if (parsedContent) {
        // Add prefix to all hrefs in the parsedContent - needed, because the links are incomplete
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

document.addEventListener("DOMContentLoaded", () => {
  const dailyTextContainer = document.getElementById('daily-text');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const closeModal = document.getElementById('close-modal');

  // Close modal functionality
  closeModal.addEventListener("click", () => {
      modal.classList.add('hidden');
  });

  // Delegate click events to links inside the daily text container
  dailyTextContainer.addEventListener("click", async (event) => {
      // Ensure the target is the closest <a> tag, if present
      const target = event.target.closest('a');

      if (target && target.tagName === "A") {
          event.preventDefault(); // Prevent default link behavior

          const url = target.href;

          try {
              const response = await fetch(url);
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const json = await response.json();
              const { caption, content } = json.items[0];

              // Clear previous content
              modalContent.innerHTML = '';

              // Create and append caption element
              const captionElement = document.createElement('h2');
              captionElement.textContent = caption;
              modalContent.appendChild(captionElement);

              // Remove <a> tags from the content
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = content; // Parse the HTML content
              const anchorTags = tempDiv.querySelectorAll('a');
              anchorTags.forEach(anchor => anchor.remove()); // Remove all <a> tags

              // Extract text content directly from the modified content
              const textContent = tempDiv.textContent.trim(); // Get the plain text and trim it

              // Create a container for the text-only content
              const textContainer = document.createElement('div');
              textContainer.textContent = textContent; // Only the text
              modalContent.appendChild(textContainer);

              // Temporarily make the modal visible to measure dimensions
              modal.classList.remove('hidden');
              modal.style.visibility = 'hidden'; // Hide from user while measuring
              modal.style.position = 'absolute'; // Ensure position adjustment works

              // Get the modal's dimensions
              const modalRect = modal.getBoundingClientRect();
              const modalHeight = modalRect.height;
              const modalWidth = modalRect.width;

              // Calculate position based on mouse click
              const offsetX = 10; // Horizontal offset
              const offsetY = 10; // Vertical offset
              const mouseX = event.clientX;
              const mouseY = event.clientY;

              // Adjust position so bottom-left corner aligns to top-right of the click
              modal.style.left = `${mouseX + offsetX}px`;
              modal.style.top = `${mouseY - modalHeight - offsetY}px`;

              // Restore visibility
              modal.style.visibility = 'visible';
          } catch (error) {
              console.error("Failed to fetch JSON:", error);
              modalContent.textContent = `Error: ${error.message}`;
              modal.classList.remove('hidden');
          }
      }
  });
});
