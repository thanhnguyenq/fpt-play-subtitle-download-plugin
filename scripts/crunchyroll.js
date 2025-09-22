window.addEventListener('load', function () {
  createVNAWindow();

  document.getElementById('vna_downloadAll').addEventListener('click', downloadAll);
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.passCode === 'vna' && /^(?:[^?]+)\.txt(?:\?|$)/.test(request.url)) {
      const id = /.*\/([^?]+)/.exec(request.url)[1];
      const item = document.getElementById(id);
      if (item == null) {
        getSubtitle(request.url, getName(), id, createDownloadButton);
      }
    }
    sendResponse();
  });

// Ass is default subtitble of crunchyroll
function getName() {
  return document.getElementsByTagName('h1')[0].textContent + '.ass';
}
