import { Container, Rectangle } from 'pixi.js';
import { emitter } from '../store/emitter';

import HandSign, { ScoreBoard } from '../components/Hub';
import Piles from '../components/Piles';
import Bird from '../components/Bird';
class GameContainer extends Container {
    public piles: Piles;
    private handSign: HandSign;
    private pointBoard: ScoreBoard;

    constructor(bird: Bird) {
        super();
        this.handSign = new HandSign();
        this.piles = new Piles(bird);
        this.pointBoard = new ScoreBoard();

        this.hitArea = new Rectangle(0, 0, window.innerWidth, window.innerHeight);
        this.handSign.visible = false;
        this.pointBoard.visible = false;
        emitter.on('onResize', ({ width, height }) => {
            this.hitArea = new Rectangle(0, 0, width, height);
        });

        this.piles.onShowComplete = () => {
            this.handSign.visible = true;
            this.pointBoard.visible = true;
            this.eventMode = 'static';
            this.cursor = 'pointer';
        };
        this.piles.onHideComplete = () => {
            this.handSign.visible = false;
            this.pointBoard.visible = false;
            this.eventMode = 'none';
            this.cursor = 'normal';
        };

        this.addChild(this.piles);
        this.addChild(this.handSign);
        this.addChild(this.pointBoard);
    }
}
export default GameContainer;
