chrome.webRequest.onCompleted.addListener(
  function (details) {
    chrome.tabs.sendMessage(details.tabId, {
      passCode: 'vna',
      url: details.url,
      responseHeaders: details.responseHeaders
    });
  }, {
  urls: ['<all_urls>'],
}, ["responseHeaders"]);
