import { Container, Graphics } from 'pixi.js';

export class CommonPopup extends Container {
    constructor() {
        super();
        const width = window.innerWidth / 2;
        const height = window.innerHeight / 2;
        this.width = width;
        this.height = height;
        this.position.x = window.innerWidth / 2 - width / 2;
        this.position.y = window.innerHeight / 2 - height / 2;
        const board = new Graphics();
        board.roundRect(0, 0, width, height, 15);
        board.fill(0xffffff);
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
