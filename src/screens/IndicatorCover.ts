import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { emitter } from '../store/emitter';

const learnedLskey = 'learnedIndicator';

class IndicatorCover extends Container {
    private indicator: Sprite;
    private info: Text;
    private cover: Graphics;
    constructor() {
        super();
        this.cover = new Graphics().rect(0, 0, window.innerWidth, window.innerHeight).fill(0x000000);
        this.cover.alpha = 0.4;
        this.visible = false;

        this.indicator = Sprite.from('indicator');
        this.indicator.width = 200;
        this.indicator.height = 200;
        this.indicator.x = 50;
        this.indicator.y = window.innerHeight / 2;
        this.info = new Text({
            text: `1. Click Anywhere to fly
2. Control Piggy to through Gap`,
            style: {
                fill: 0xfd6f90,
                fontFamily: 'Shrikhand',
                fontSize: 60,
            },
        });
        this.info.width = window.innerWidth / 2;
        this.info.height = (window.innerWidth / 2) * 0.3;
        this.info.x = 300;
        this.info.y = window.innerHeight / 2;
        this.addChild(this.cover);
        this.addChild(this.indicator);
        this.addChild(this.info);
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointerdown', () => {
            this.hide();
        });

        emitter.on('onResize', ({ width, height }) => {
            this.cover.width = width;
            this.cover.height = height;
            this.indicator.y = height / 2;
            this.info.y = height / 2;
            this.info.width = width / 2;
            this.info.height = (width / 2) * 0.3;
        });
    }
    public show() {
        const learned = window.localStorage.getItem(learnedLskey);
        if (!learned) {
            this.visible = true;
        }
    }
    public hide() {
        window.localStorage.setItem(learnedLskey, 'learned');
        this.visible = false;
    }
}

export default IndicatorCover;
