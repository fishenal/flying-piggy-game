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
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minWidth = 920;
    const minHeight = 480;

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

    emitter.emit('onResize', { width: width, height: height });
}

/** Setup app and initialise assets */
async function init() {
    // Initialize app
    await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: 0xffffff,
        autoDensity: true,
    });
    await window.CrazyGames.SDK.init();
    window.addEventListener('resize', resize);

    // Add pixi canvas element (app.canvas) to the document's body
    document.body.appendChild(app.canvas);

    const loadScreen = new LoadScreen();
    app.stage.addChild(loadScreen);
    await window.CrazyGames.SDK.game.loadingStart();
    // Setup assets bundles (see assets.ts) and start up loading everything in background
    await initAssets();

    await window.CrazyGames.SDK.game.loadingStop();

    app.stage.removeChild(loadScreen);

    const gameScreen = new GameScreen();

    app.stage.addChild(gameScreen);
    resize();
}

// Init everything
init();
