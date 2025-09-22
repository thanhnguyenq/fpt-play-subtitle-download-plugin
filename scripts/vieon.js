window.addEventListener('load', function () {
  createVNAWindow();

  document.getElementById('vna_downloadAll').addEventListener('click', downloadAll);
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.passCode === 'vna' && isSubFile(request.responseHeaders)) {
      const id = /.*\/([^?]+)/.exec(request.url)[1];
      const item = document.getElementById(id);
      if (item == null) {
        getSubtitle(request.url, getName(), id, createDownloadButton);
      }
    }
    sendResponse();
  });

function getName() {
  return document.getElementsByTagName('h1')[0].textContent + '.vtt';
}

function isSubFile(headers) {
  const contentTypeHeader = headers.find(
    header => header.name.toLowerCase() === 'content-type'
  );
  if (contentTypeHeader.value === 'text/vtt') {
    return true;
  }
  return false;
}
