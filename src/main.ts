import '@pixi/spine-pixi';
import { Application } from 'pixi.js';
import { initAssets } from './utils/assets';
import GameScreen from './screens/GameScreen';
import LoadScreen from './screens/LoadScreen';
import StartScreen from './screens/StartScreen';
import { emitter } from './store/emitter';

/** The PixiJS app Application instance, shared across the project */
export const app = new Application();

globalThis.__PIXI_APP__ = app;
/** Set up a resize function for the app */
function resize() {
    // const windowWidth = window.innerWidth;
    // const windowHeight = window.innerHeight;
    // const minWidth = 900;
    // const minHeight = 700;

    // Calculate renderer and canvas sizes based on current dimensions
    // const scaleX = windowWidth < minWidth ? windowWidth / minWidth : 1;
    // const scaleY = windowHeight < minHeight ? windowHeight / minHeight : 1;
    // const scale = Math.min(scaleX, scaleY);
    // app.stage.scale = scale;
    emitter.emit('onResize', { width: window.innerWidth, height: window.innerHeight });
}

/** Setup app and initialise assets */
async function init() {
    // Initialize app
    await app.init({
        resolution: window.devicePixelRatio,
        backgroundColor: 0xffffff,
        autoDensity: true,
        resizeTo: window,
    });

    window.addEventListener('resize', resize);

    // Add pixi canvas element (app.canvas) to the document's body
    document.body.appendChild(app.canvas);

    const loadScreen = new LoadScreen();
    app.stage.addChild(loadScreen);
    // Setup assets bundles (see assets.ts) and start up loading everything in background
    await initAssets();

    app.stage.removeChild(loadScreen);

    // const startScreen = new StartScreen();
    const gameScreen = new GameScreen();

    app.stage.addChild(gameScreen);

    // resize();
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
