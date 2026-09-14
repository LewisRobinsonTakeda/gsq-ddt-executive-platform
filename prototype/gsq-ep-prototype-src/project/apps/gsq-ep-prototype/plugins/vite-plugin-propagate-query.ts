import type { Plugin, IndexHtmlTransformContext } from 'vite';

export function propagateQueryPlugin(): Plugin {
  return {
    name: 'vite-plugin-propagate-query',

    transformIndexHtml(html: string, ctx?: IndexHtmlTransformContext) {
      if (!ctx || !ctx.bundle) return html;

      // Get hashed JS and CSS file names from the output bundle
      let mainScript = '';
      let mainStyle = '';

      for (const fileName in ctx.bundle) {
        if (fileName.endsWith('.js') && ctx.bundle[fileName].type === 'chunk') {
          mainScript = fileName;
        } else if (fileName.endsWith('.css')) {
          mainStyle = fileName;
        }
      }

      const runtimeScript = `
<script>
(function injectAssetsWithQuery() {
  const query = window.location.search;

  const basePath = window.location.pathname.replace(/\\/[^/]*$/, '/');
  const appendQuery = (url) => {
    if (!query || !url || url.includes('?') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    try {
      const parsed = url.startsWith('http')
        ? new URL(url)
        : new URL((url.startsWith('/') ? basePath + url.slice(1) : basePath + url), window.location.origin);
      if (parsed.origin !== window.location.origin) return url;
      parsed.search = query;
      return parsed.toString();
    } catch (e) {
      return url;
    }
  };

  // Inject JS
  const script = document.createElement('script');
  script.type = 'module';
  script.src = appendQuery('./${mainScript}');
  document.head.appendChild(script);

  // Inject CSS
  ${
    mainStyle
      ? `
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = appendQuery('./${mainStyle}');
  document.head.appendChild(style);
  `
      : ''
  }

  // Patch image.src (React often sets the property; some hosts resolve it to an absolute URL first)
  const originalImageSrc = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
  if (originalImageSrc && originalImageSrc.set) {
    Object.defineProperty(Image.prototype, 'src', {
      set(value) {
        const newVal = appendQuery(value);
        originalImageSrc.set.call(this, newVal);
      },
    });
  }
  const originalSetAttribute = HTMLImageElement.prototype.setAttribute;
  HTMLImageElement.prototype.setAttribute = function(name, value) {
    if (String(name).toLowerCase() === 'src') value = appendQuery(value);
    return originalSetAttribute.call(this, name, value);
  };

  // Patch fetch
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string') {
      input = appendQuery(input);
    } else if (input instanceof Request) {
      input = new Request(appendQuery(input.url), input);
    }
    return originalFetch(input, init);
  };
})();
</script>`;

      // Strip all static JS/CSS references and inject runtime script
      return html
        .replace(/<script[^>]*type="module"[^>]*src="[^"]+"[^>]*><\/script>/g, '')
        .replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]+"[^>]*>/g, '')
        .replace('</head>', `${runtimeScript}\n</head>`);
    },
  };
}

export default propagateQueryPlugin;
