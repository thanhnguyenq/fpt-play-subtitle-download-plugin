chrome.webRequest.onCompleted.addListener(
  function (details) {
    // If the request was initiated by the extension itself (via getSubtitle), ignore it.
    if (details.url.includes('vna_request=true')) {
      return;
    }
    chrome.tabs.sendMessage(details.tabId, {
      passCode: 'vna',
      url: details.url,
      responseHeaders: details.responseHeaders
    });
  }, {
  urls: ['<all_urls>'],
}, ["responseHeaders"]);
