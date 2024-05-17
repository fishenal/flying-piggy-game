import { Container, Graphics, Sprite, Texture, Text } from 'pixi.js';
import { emitter } from '../store/emitter';

import { scoreSingleton } from '../store/score';
export class HandSign extends Sprite {
    constructor() {
        super(Texture.from('hand'));
        emitter.on('isPausedChange', (status) => {
            this.visible = status;
        });
        this.width = 60;
        this.height = 70;
        this.position.x = 75;
        this.position.y = 240;
        this.visible = true;
    }
}

export class ScoreBoard extends Container {
    private point: Text;
    constructor() {
        super();
        emitter.on('scoreChange', (score) => {
            this.point.text = score;
        });
        const width = 100;
        const height = 70;
        this.width = width;
        this.height = height;
        this.pivot.x = 50;
        this.pivot.y = 0;
        this.position.x = window.innerWidth / 2;
        this.position.y = 5;
        const board = new Graphics();
        board.roundRect(0, 0, width, height, 15);
        board.fill(0x000);
        this.addChild(board);
        this.point = new Text({
            text: String(0),
            style: {
                fontSize: 48,
                fill: 0xffffff,
                align: 'center',
                padding: 20,
            },
        });
        this.point.position.x = 38;
        this.point.position.y = 10;
        this.addChild(this.point);
    }
    public reset() {
        scoreSingleton.reset();
    }
}

export default HandSign;
