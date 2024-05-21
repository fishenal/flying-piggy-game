import { Container, NineSliceSprite, Texture } from 'pixi.js';
import { emitter } from '../store/emitter';

export class CommonPopup extends Container {
    private board: NineSliceSprite;
    constructor() {
        super();
        emitter.on('onResize', ({ width, height }) => {
            const popWidth = width / 1.5;
            const popHeight = height / 1.5;
            this.width = popWidth;
            this.height = popHeight;
            this.position.x = width / 2 - popWidth / 2;
            this.position.y = height / 2 - popHeight / 2;
            this.board.width = popWidth;
            this.board.height = popHeight;
            this.onResize({ width: popWidth, height: popHeight });
        });
        const popWidth = window.innerWidth / 1.5;
        const popHeight = window.innerHeight / 1.5;
        this.width = popWidth;
        this.height = popHeight;
        this.position.x = window.innerWidth / 2 - popWidth / 2;
        this.position.y = window.innerHeight / 2 - popHeight / 2;
        this.board = new NineSliceSprite({
            texture: Texture.from('popBg'),
            topHeight: 55,
            bottomHeight: 55,
            leftWidth: 55,
            rightWidth: 55,
            width: popWidth,
            height: popHeight,
        });
        this.addChild(this.board);
        this.visible = false;
        // this.renderButton();
    }
    public show() {
        this.visible = true;
    }
    public hide() {
        this.visible = false;
    }
    public onResize(param: { width: number; height: number }) {}
}
