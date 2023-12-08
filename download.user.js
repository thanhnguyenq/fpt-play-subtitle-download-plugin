// ==UserScript==
// @name         FPT Play Subtitle Downloader [VTT]
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download subtitle from FPT Play
// @author       Chiefileum
// @match        https://fptplay.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fptplay.vn
// @run-at       document-start
// @updateURL    https://github.com/thanhnguyenq/fpt-play-subtitle-download-plugin/raw/main/download.user.js
// @downloadURL  https://github.com/thanhnguyenq/fpt-play-subtitle-download-plugin/raw/main/download.user.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    const downloadBtnId = 'chiefileum_download_btn';
    var fileName = '';

    function getVTTSubtitle(url, callBackFn) {
        GM_xmlhttpRequest ({
            method:     "GET",
            url,
            onload:     function (response) {
                callBackFn(response.responseText);
            }
        });
    }

    function createDownloadButton(data) {
        var blob = new Blob([data], {
            type: 'text/vtt'
        });

        if(document.getElementById(downloadBtnId)) {
            document.getElementById(downloadBtnId).href = URL.createObjectURL(blob);
            return;
        }

        const newButton = document.createElement('a');
        newButton.textContent = 'Download Sub';
        newButton.download = fileName;
        newButton.href = URL.createObjectURL(blob);
        newButton.id = downloadBtnId;
        newButton.className ='resolution-switcher';

        var node = document.getElementsByClassName('vjs-control-bar')[0];
        node.appendChild(newButton);
    }

    const oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(){
        if(this.url && this.url.endsWith(".vtt")) {
            fileName = this.url.split("/").at(-1);
            getVTTSubtitle(this.url, createDownloadButton);
        }
        oldSend.apply(this, arguments);
    }
})();
