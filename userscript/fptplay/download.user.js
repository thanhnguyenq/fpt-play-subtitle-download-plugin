// ==UserScript==
// @name         FPT Play Subtitle Downloader [VTT]
// @namespace    https://www.facebook.com/vnanime.net/
// @version      0.8
// @description  Download subtitle from FPT Play
// @author       Chiefileum
// @match        https://fptplay.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fptplay.vn
// @run-at       document-start
// @updateURL    https://github.com/thanhnguyenq/subtitle-downloader-extension/raw/main/userscript/fptplay/download.user.js
// @downloadURL  https://github.com/thanhnguyenq/subtitle-downloader-extension/raw/main/userscript/fptplay/download.user.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    const downloadBtnId = 'chiefileum_download_btn';

    function getVTTSubtitle(url, callBackFn) {
        var name = /.*\/([^?]+)/.exec(url)[1];
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: function (response) {
                callBackFn(response.responseText, name);
            }
        });
    }

    function createDownloadButton(data, filename = 'vna.vtt') {
        var blob = new Blob([data]);

        if (document.getElementById(downloadBtnId)) {
            document.getElementById(downloadBtnId).href = URL.createObjectURL(blob);
            return;
        }

        const newButton = document.createElement('a');
        newButton.textContent = 'Download Sub';
        newButton.href = URL.createObjectURL(blob);
        newButton.id = downloadBtnId;
        newButton.download = filename;

        const targetDiv = document.querySelector('.c-control-button.c-control-button-report .c-control-button-icon');
        targetDiv.replaceChildren(newButton);
    }

    const constantMock = window.fetch;
    unsafeWindow.fetch = function () {
        // Get the parameter in arguments
        // Intercept the parameter here
        for (const arg of arguments) {
            if (typeof arg === 'string' || arg instanceof String) {
                if (arg.endsWith(".vtt")) {
                    getVTTSubtitle(arg, createDownloadButton);
                }
            }
        }
        return constantMock.apply(this, arguments)
    }
})();
