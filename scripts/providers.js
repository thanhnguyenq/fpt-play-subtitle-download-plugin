const vnaProviders = [
  {
    name: 'Crunchyroll',
    matches: ['*://*.crunchyroll.com/watch/*'],
    isSubtitle: (request) => /^(?:[^?]+)\.txt(?:\?|$)/.test(request.url),
    getFileName: () => {
      const h1 = document.getElementsByTagName('h1')[0];
      return h1 ? h1.textContent + '.ass' : 'subtitle.ass';
    },
    getId: (request) => /.*\/([^?]+)/.exec(request.url)[1],
  },
  {
    name: 'FPT Play',
    matches: ['*://fptplay.vn/*'],
    isSubtitle: (request) => /^(?:[^?]+)\.vtt(?:\?|$)?/.test(request.url),
    getFileName: (request) => /.*\/([^?]+)/.exec(request.url)[1],
    getId: (request) => /.*\/([^?]+)/.exec(request.url)[1],
  },
  {
    name: 'Vieon',
    matches: ['*://vieon.vn/*'],
    isSubtitle: (request) => {
      const contentTypeHeader = request.responseHeaders.find(
        header => header.name.toLowerCase() === 'content-type'
      );
      return contentTypeHeader && contentTypeHeader.value === 'text/vtt';
    },
    getFileName: () => {
      const h1 = document.getElementsByTagName('h1')[0];
      return h1 ? h1.textContent + '.vtt' : 'subtitle.vtt';
    },
    getId: (request) => /.*\/([^?]+)/.exec(request.url)[1],
  },
];
