import { Container, Sprite, Texture } from 'pixi.js';
import { emitter } from '../store/emitter';

import { scoreSingleton } from '../store/score';
import { CommonBoard } from '../ui/CommonBoard';
export class HandSign extends Sprite {
    constructor() {
        super(Texture.from('indicator'));
        emitter.on('isPausedChange', (status) => {
            this.visible = status;
        });
        emitter.on('onResize', ({ height }) => {
            this.position.y = height / 4 + 150;
            // this.bird.width = width / 4;
            // this.bird.height = height / 4;
        });
        this.width = 100;
        this.height = 100;
        this.position.x = 160;
        this.position.y = window.innerHeight / 4 + 150;
        this.visible = true;
    }
}

export class ScoreBoard extends Container {
    constructor() {
        super();
        const width = 200;
        const height = 50;
        const scoreBoard = new CommonBoard({
            label: '0',
            width,
            height,
            padding: 10,
        });
        emitter.on('scoreChange', (score: number) => {
            scoreBoard.update({
                label: String(score),
            });
        });
        emitter.on('onResize', ({ width }) => {
            this.position.x = width / 2 + this.width / 2;
        });
        emitter.on('onReset', () => {
            this.reset();
        });
        emitter.on('onBack', () => {
            this.reset();
        });
        this.width = width;
        this.height = height;
        this.pivot.x = 50;
        this.pivot.y = 0;
        this.position.x = window.innerWidth / 2 + width / 2;
        this.position.y = 5;

        this.addChild(scoreBoard);
    }
    public reset() {
        scoreSingleton.reset();
    }
}

export default HandSign;
