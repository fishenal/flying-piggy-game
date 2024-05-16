import '@pixi/spine-pixi';

import { Application } from 'pixi.js';
import { initAssets } from './utils/assets';
import GameScreen from './screens/GameScreen';
import LoadScreen from './screens/LoadScreen';

/** The PixiJS app Application instance, shared across the project */
export const app = new Application();

globalThis.__PIXI_APP__ = app;
/** Set up a resize function for the app */
function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minWidth = 375;
    const minHeight = 700;

    // Calculate renderer and canvas sizes based on current dimensions
    const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
    const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
    const scale = scaleX > scaleY ? scaleX : scaleY;
    const width = windowWidth * scale;
    const height = windowHeight * scale;

    // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
    app.renderer.canvas.style.width = `${windowWidth}px`;
    app.renderer.canvas.style.height = `${windowHeight}px`;
    window.scrollTo(0, 0);

    // Update renderer  and navigation screens dimensions
    app.renderer.resize(width, height);
    // navigation.resize(width, height);
}

/** Setup app and initialise assets */
async function init() {
    // Initialize app
    await app.init({
        // resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: 0xffffff,
        resizeTo: window,
    });

    // Add pixi canvas element (app.canvas) to the document's body
    document.body.appendChild(app.canvas);

    // Whenever the window resizes, call the 'resize' function
    // window.addEventListener('resize', resize);

    // Trigger the first resize
    // resize();
    const loadScreen = new LoadScreen();
    app.stage.addChild(loadScreen);
    // Setup assets bundles (see assets.ts) and start up loading everything in background
    await initAssets();

    app.stage.removeChild(loadScreen);
    const gameScreen = new GameScreen();

    app.stage.addChild(gameScreen);

    // app.ticker.stop();
    // Add a persisting background shared by all screens
    // navigation.setBackground(TiledBackground);

    // Show initial loading screen
    // await navigation.showScreen(LoadScreen);

    // Go to one of the screens if a shortcut is present in url params, otherwise go to home screen
    // if (getUrlParam('game') !== null) {
    //     await navigation.showScreen(GameScreen);
    // } else if (getUrlParam('load') !== null) {
    //     await navigation.showScreen(LoadScreen);
    // } else if (getUrlParam('result') !== null) {
    //     await navigation.showScreen(ResultScreen);
    // } else {
    //     await navigation.showScreen(HomeScreen);
    // }
}

// Init everything
init();

// function animate() {
//     stats.begin();

//     // monitored code goes here

//     stats.end();

//     requestAnimationFrame(animate);
// }

// requestAnimationFrame(animate);
