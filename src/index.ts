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

  const response = await fetch(svgUrl);
  if (!response.ok) {
    return new Response(`Failed to fetch SVG from ${svgUrl}: ${response.statusText}`, {
      status: response.status,
      statusText: response.statusText,
    });
  }
  const body = await response.text();

  await initWasm(wasm);

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
  // @ts-ignore
  return new Response(buf, { headers: { 'content-type': 'image/png' } });
};

export default { fetch: handleRequest };
