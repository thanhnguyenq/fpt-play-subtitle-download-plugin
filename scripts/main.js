// Helper to check if a URL matches a manifest pattern
function matchesPattern(pattern, url) {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  return regex.test(url);
}

// Find which providers are active for the current page
const activeProviders = vnaProviders.filter(provider =>
  provider.matches.some(pattern => matchesPattern(pattern, window.location.href))
);

// A set to track subtitle URLs that are currently being fetched to prevent duplicates.
const pendingSubtitleIds = new Set();

// If any provider is active for this page, initialize the extension
if (activeProviders.length > 0) {
  console.log('Subtitle Downloader: Active providers found:', activeProviders.map(p => p.name).join(', '));

  // Create the UI once the page is loaded
  window.addEventListener('load', function () {
    createVNAWindow();
    const downloadAllButton = document.getElementById('vna_downloadAll');
    if (downloadAllButton) {
      downloadAllButton.addEventListener('click', downloadAll);
    }
  });

  // Listen for subtitle network requests
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.passCode !== 'vna') {
      return;
    }

    // Check the request against each active provider
    for (const provider of activeProviders) {
      if (provider.isSubtitle(request)) {
        const id = provider.getId(request);
        // Check if element doesn't exist and is not already being fetched.
        if (document.getElementById(id) === null && !pendingSubtitleIds.has(id)) {
          pendingSubtitleIds.add(id);
          try {
            const name = provider.getFileName(request);
            await getSubtitle(request.url, name, id, createDownloadButton);
          } finally {
            // Always remove the ID from the pending set, even if fetch fails.
            pendingSubtitleIds.delete(id);
          }
          break; // Assume first provider that matches is the correct one
        }
      }
    }
  });
}
