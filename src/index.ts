import { initWasm, Resvg } from '@resvg/resvg-wasm';
import wasm from './index_bg.wasm';
import roboto from './fonts/web/Roboto[ital,wdth,wght].ttf';
import robotoBold from './fonts/web/static/Roboto-Bold.ttf';
import robotoRegular from './fonts/web/static/Roboto-Regular.ttf';
import robotoItalic from './fonts/web/static/Roboto-Italic.ttf';
import robotoBoldItalic from './fonts/web/static/Roboto-BoldItalic.ttf';
import robotoLight from './fonts/web/static/Roboto-Light.ttf';
import robotoLightItalic from './fonts/web/static/Roboto-LightItalic.ttf';
import robotoMedium from './fonts/web/static/Roboto-Medium.ttf';
import robotoMediumItalic from './fonts/web/static/Roboto-MediumItalic.ttf';
import robotoThin from './fonts/web/static/Roboto-Thin.ttf';
import robotoThinItalic from './fonts/web/static/Roboto-ThinItalic.ttf';

let initWasmPromise: Promise<void> | null = null;

const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  if (url.pathname !== '/render') {
    return new Response(`
      <h1>This is a simple web-service that renders SVG to PNG.</h1>
      <p>See <a href="https://github.com/dom96/svg-renderer">https://github.com/dom96/svg-renderer</a> for more information.</p>
    `,
    {
      headers: { 'content-type': 'text/html' },
    });
  }

  const svgUrl = url.searchParams.get('svg');
  if (svgUrl === null) {
    return new Response("svg param not present", {
      headers: { 'content-type': 'text/html' },
    });
  }

  // Check cache first
  const cache = caches.default;
  const cacheKey = new Request(req.url, req);
  let response = await cache.match(cacheKey);

  if (response) {
    // Return cached response with cache hit header
    const cachedResponse = new Response(response.body, response);
    cachedResponse.headers.set('X-Cache', 'HIT');
    return cachedResponse;
  }

  // Cache miss - fetch and render SVG
  const svgResponse = await fetch(svgUrl);
  if (!svgResponse.ok) {
    return new Response(`Failed to fetch SVG from ${svgUrl}: ${svgResponse.statusText}`, {
      status: svgResponse.status,
      statusText: svgResponse.statusText,
    });
  }
  const body = await svgResponse.text();

  if (!initWasmPromise) {
    initWasmPromise = initWasm(wasm);
  }
  await initWasmPromise;

  const opts = {
    font: {
      loadSystemFonts: false,
      fontBuffers: [
        new Uint8Array(roboto),
        new Uint8Array(robotoBold),
        new Uint8Array(robotoRegular),
        new Uint8Array(robotoItalic),
        new Uint8Array(robotoBoldItalic),
        new Uint8Array(robotoLight),
        new Uint8Array(robotoLightItalic),
        new Uint8Array(robotoMedium),
        new Uint8Array(robotoMediumItalic),
        new Uint8Array(robotoThin),
        new Uint8Array(robotoThinItalic),
      ],
      defaultFontFamily: 'Roboto',
    },
  };

  const resvg = new Resvg(body, opts);
  const pngData = resvg.render();
  const buf = pngData.asPng();

  // Create response with cache headers
  // @ts-ignore
  response = new Response(buf, {
    headers: {
      'content-type': 'image/png',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'X-Cache': 'MISS'
    }
  });

  // Store in cache
  await cache.put(cacheKey, response.clone());

  return response;
};

export default { fetch: handleRequest };
