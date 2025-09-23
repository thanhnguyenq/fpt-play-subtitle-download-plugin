const subtitleBlobs = new Map();

// Setup popup window
function createVNAWindow() {
  const jsFrame = new JSFrame();
  //Create window
  const frame = jsFrame.create({
    title: 'VnAnime',
    left: 0,
    top: 0,
    width: 320,
    height: 150,
    movable: true, //Enable to be moved by mouse
    resizable: true, //Enable to be resized by mouse
    style: {
      overflow: 'auto'
    },
    html: "<div id='vna_content' style='padding:10px;font-size:12px;color:darkgray;'></div><button style='padding:10px;font-size:12px;bottom: 0;right: 0;position: absolute;color: black' id='vna_downloadAll'>Download All</button>"
  });

  // Bring window to front
  frame.parentCanvas.parentElement.style.zIndex = '9999999';

  frame.show();
}

async function getSubtitle(url, name, id, callBackFn) {
  try {
    const fetchUrl = new URL(url);
    fetchUrl.searchParams.append('vna_request', 'true');
    const response = await fetch(fetchUrl.href);
    const data = await response.text();
    callBackFn(name, id, data);
  } catch (error) {
    console.error(`Failed to download subtitle from ${url}:`, error);
  }
}

function createDownloadButton(name, id, data) {
  const blob = new Blob([data], {
    type: 'text/plain'
  });

  subtitleBlobs.set(id, { name, blob });

  const aTag = document.createElement('a');
  aTag.className = 'vna_link';
  aTag.id = id;
  aTag.textContent = name;
  aTag.download = name;
  aTag.href = URL.createObjectURL(blob);
  aTag.style.display = 'table';
  waitForElm('#vna_content').then((vna_content) => {
    vna_content.appendChild(aTag);
  });
}

function downloadAll() {
  for (const { name, blob } of subtitleBlobs.values()) {
    saveAs(blob, name);
  }
  clearElement('vna_content');
  subtitleBlobs.clear();
}

function clearElement(id) {
  document.getElementById(id).innerHTML = "";
}

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
