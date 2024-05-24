import { Container, Graphics } from 'pixi.js';
import { emitter } from '../store/emitter';
import gsap from 'gsap';

export class CommonPopup extends Container {
    private board: Graphics;
    private outX: number;
    constructor() {
        super();
        this.outX = window.innerWidth + 2000;

        const width = window.innerWidth / 1.2;
        this.width = width;
        const height = window.innerHeight / 1.2;
        this.height = height;
        this.pivot.x = width / 2;
        this.pivot.y = height / 2;
        emitter.on('onResize', ({ width, height }) => {
            const _width = width / 1.2;
            this.width = _width;
            const _height = height / 1.2;
            this.height = _height;
            if (this.visible) {
                this.show();
            }
        });
        this.board = new Graphics();
        this.board.roundRect(0, 0, width, height, 30);
        this.board.fill(0xfd6f90);
        this.board.stroke({ width: 30, color: 0x84d0ff });
        this.addChild(this.board);
        this.position.x = this.outX;
        this.visible = false;
    }
    public show() {
        this.visible = true;
        gsap.to(this, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            duration: 0.5,
            ease: 'power2.inOut',
        });
    }
    public hide() {
        gsap.to(this, {
            x: 3000,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                this.visible = false;
                gsap.killTweensOf(this);
            },
        });
    }
}
