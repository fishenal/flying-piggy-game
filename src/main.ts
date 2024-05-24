import { Application } from 'pixi.js';
import { initAssets } from './utils/assets';
import GameScreen from './screens/GameScreen';
import LoadScreen from './screens/LoadScreen';
import { emitter } from './store/emitter';

declare global {
    interface Window {
        CrazyGames: any;
    }
}

/** The PixiJS app Application instance, shared across the project */
export const app = new Application();

// globalThis.__PIXI_APP__ = app;
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
    await window.CrazyGames.SDK.init();

    app.stage.removeChild(loadScreen);

    const gameScreen = new GameScreen();

    app.stage.addChild(gameScreen);
}

// Init everything
init();
