# svg-renderer

This is a simple web-service that renders SVG to PNG.

## Usage

```
curl "https://svg-renderer.dom96.workers.dev/render?svg=https://example.com/image.svg"
```

## Fonts

The fonts are from https://github.com/googlefonts/roboto-3-classic/. The `build` will take care of the download and copying of the fonts to the `src` directory.


## License

MIT

This project use [resvg](https://github.com/RazrFalcon/resvg) that project is licensed under the MPLv2.0.
