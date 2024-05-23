import { Container, Graphics } from 'pixi.js';
import { emitter } from '../store/emitter';
import gsap from 'gsap';

export class CommonPopup extends Container {
    private board: Graphics;
    private toX: number;
    constructor() {
        super();
        emitter.on('onResize', ({ width, height }) => {
            const popWidth = width / 1.5;
            const popHeight = height / 1.5;
            this.width = popWidth;
            this.height = popHeight;
            this.toX = width / 2 - popWidth / 2;
            this.position.x = width / 2 - popWidth / 2;
            this.position.y = height / 2 - popHeight / 2;
            this.board.width = popWidth;
            this.board.height = popHeight;
        });
        const popWidth = window.innerWidth / 1.5;
        const popHeight = window.innerHeight / 1.5;
        this.width = popWidth;
        this.height = popHeight;
        this.toX = window.innerWidth / 2 - popWidth / 2;
        this.position.x = -3000;
        this.position.y = window.innerHeight / 2 - popHeight / 2;
        this.board = new Graphics();
        this.board.roundRect(0, 0, popWidth - 60, popHeight - 60, 30);
        this.board.fill(0xfd6f90);
        this.board.stroke({ width: 30, color: 0x84d0ff });
        this.addChild(this.board);
        this.visible = false;
    }
    public show() {
        this.visible = true;
        gsap.to(this, {
            x: this.toX,
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
