# PWA Webpack Boilerplate with es6 Support

A boilerplate for building Single Page Applications

#### Installation
- `brew install nss`
- `npm i`
- `npm run nodedev`: Run node development server with backend
- `npm run webpackdev`: Run webpack development server with backend
- `npm run nodefront`: Run only node development server
- `npm run stage`: Build and run production build
- `npm run build`: Build production distribution
- `npm clean`: Clean remove production build
- Public folder: `src/assets`

#### What's Included
- Webpack Dev and Production Configuration
- eslinting
- SASS
- Progressive Web App
- Sample Backend Server
- Socket.io font and backend
- Tensorflow JS
- BabylonJS
- PixiJS
- [Three2d](src/scripts/three2d/README.md)

#### TODO
- [ ] Add support for capacitor
- [ ] Further optimize webpack production build
- [ ] Add Unit Tests


# Going Beyond

#### Neural Nets
- https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&index=2&t=0s

- Bitmap font generator: https://github.com/soimy/msdf-bmfont-xml/
- Three Bitmap Fonts: https://tympanus.net/codrops/2019/10/10/create-text-in-three-js-with-three-bmfont-text/

# Other
- Unlock Chrome Framerate: `open -a "Google Chrome" --args --disable-gpu-vsync`


# BUGS
- Camera rotates zx axis on click for no reason.