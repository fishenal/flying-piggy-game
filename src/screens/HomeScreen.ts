import { Container, Sprite, TilingSprite } from 'pixi.js';
import { birdConfig, globalConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import Bird from './Bird';
import { HandSign, ScoreBoard } from './Hub';
import Piles from './Piles';

class HomeScreen extends Container {
    private isPaused: boolean = true;
    constructor() {
        super();
        this.eventMode = 'static';
        this.cursor = 'pointer';

        const bg = Sprite.from('bg');
        bg.width = window.innerWidth;
        bg.height = window.innerHeight - globalConfig.groundHeight;
        this.addChild(bg);
        const fb = TilingSprite.from('run_bg', {
            width: window.innerWidth,
            height: globalConfig.groundHeight,
            x: 0,
            y: window.innerHeight - globalConfig.groundHeight,
        });
        this.addChild(fb);

        const bird = new Bird();

        this.addChild(bird);
        const handSign = new HandSign();
        this.addChild(handSign);

        const piles = new Piles(bird);
        this.addChild(piles);

        const pointBoard = new ScoreBoard();
        this.addChild(pointBoard);

        this.on('pointerdown', () => {
            console.log('run here');
            //toggle();
            emitter.emit('isPausedChange', false);
            this.isPaused = false;

            bird.verSpeed = birdConfig.intSpeed;
        });

        // app.ticker.stop();
        this.onRender = () => {
            if (this.isPaused) return;
            fb.tilePosition.x -= globalConfig.groundSpeed;
        };
    }
}

export default HomeScreen;
