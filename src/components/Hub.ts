import { Container, Graphics, Sprite, Texture, Text } from 'pixi.js';
import { emitter } from '../store/emitter';

import { scoreSingleton } from '../store/score';
import { CommonBoard } from '../ui/CommonBoard';
export class HandSign extends Sprite {
    constructor() {
        super(Texture.from('hand'));
        emitter.on('isPausedChange', (status) => {
            this.visible = status;
        });
        this.width = 127;
        this.height = 184;
        this.position.x = 160;
        this.position.y = 350;
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
            this.position.x = width / 2 + width / 2;
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
