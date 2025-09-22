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

  // Bring to front
  const links = document.getElementsByTagName('div');
  const len = links.length;
  const str = '';
  for (let i = 0; i < len; i++) {
    if (links[i].id.includes('jsFrame_fixed')) {
      links[i].style.zIndex = '9999999';
    };
  }

  frame.show();
}

function getSubtitle(url, name, id, callBackFn) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);
  callBackFn(name, id, xmlHttp.responseText);
}

function createDownloadButton(name, id, data) {
  var blob = new Blob([data], {
    type: 'text/vtt'
  });

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
  const urls = document.getElementsByClassName('vna_link');
  for (let url of urls) {
    fetch(url.href)
      .then(res => res.blob())
      .then(blob => {
        saveAs(blob, url.download);
      });
  }
  clearElement('vna_content');
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
