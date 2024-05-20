import { Container, NineSliceSprite, Texture } from 'pixi.js';

export class CommonPopup extends Container {
    constructor() {
        super();
        const width = window.innerWidth / 1.5;
        const height = window.innerHeight / 1.5;
        this.width = width;
        this.height = height;
        this.position.x = window.innerWidth / 2 - width / 1.5;
        this.position.y = window.innerHeight / 2 - height / 1.5;
        const board = new NineSliceSprite({
            texture: Texture.from('popBg'),
            topHeight: 55,
            bottomHeight: 55,
            leftWidth: 55,
            rightWidth: 55,
            width,
            height,
        });
        this.addChild(board);
        this.visible = false;
        // this.renderButton();
    }
    public show() {
        this.visible = true;
    }
    public hide() {
        this.visible = false;
    }
}
