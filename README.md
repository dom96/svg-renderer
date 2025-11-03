# svg-renderer

A very simple Cloudflare Worker which renders SVG files to PNG using the resvg library.

## Usage

There is currently just one endpoint:

```
curl "https://svg-renderer.dom96.workers.dev/render?svg=https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/tiger.svg"
```

The response will be a PNG image. The SVG file is fetched from the URL provided in the `svg` query parameter.

> [!WARNING]
> **The above API provides no guarantees of availability.**
>
> It is provided as-is and without any warranty. You're best off hosting your own instance of this Worker if you need a reliable service.

## Fonts

The fonts are from https://github.com/googlefonts/roboto-3-classic/. The `build` step will take care of the download and copying of the fonts to the `src` directory. To run it manually just execute `npm run build`.


## License

MIT

This project uses [resvg](https://github.com/RazrFalcon/resvg) which is licensed under the MPLv2.0.
