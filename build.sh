cp ./node_modules/@resvg/resvg-wasm/index_bg.wasm ./src/index_bg.wasm

if [ ! -f "Roboto_v3.013.zip" ]; then
  wget https://github.com/googlefonts/roboto-3-classic/releases/download/v3.013/Roboto_v3.013.zip
fi

# unzip into subdir
unzip Roboto_v3.013.zip -d ./src/fonts
