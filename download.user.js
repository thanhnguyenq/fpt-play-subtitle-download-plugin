// ==UserScript==
// @name         FPT Play Subtitle Downloader [VTT]
// @namespace    http://tampermonkey.net/
// @version      0.4
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
        newButton.href = URL.createObjectURL(blob);
        newButton.id = downloadBtnId;
        newButton.className ='resolution-switcher';


        waitForElm(".vjs-control-bar").then((elm) => {
            // Get file name
            newButton.download = document.getElementsByClassName('frames__background__active')[0]
                .parentNode
                .parentNode
                .getElementsByClassName('frames__content__info__title')[0]
                .title.replace(/[/\\?%*:|"<>]/g, '') + '.vtt';

            // Create button
            elm.appendChild(newButton);
        });
        var node = document.getElementsByClassName('vjs-control-bar')[0];
        node.appendChild(newButton);
    }

    const oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(){
        if(this.url && this.url.endsWith(".vtt")) {
            getVTTSubtitle(this.url, createDownloadButton);
        }
        oldSend.apply(this, arguments);
    }
})();
