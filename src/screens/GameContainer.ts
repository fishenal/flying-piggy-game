import { Container, Rectangle } from 'pixi.js';
import { emitter } from '../store/emitter';
import gsap from 'gsap';
import HandSign, { ScoreBoard } from '../components/Hub';
import Piles from '../components/Piles';
import Bird from '../components/Bird';
import { pileConfig } from '../utils/config';
class GameContainer extends Container {
    private piles: Piles;
    private handSign: HandSign;
    private pointBoard: ScoreBoard;
    private outX: number;
    constructor(bird: Bird) {
        super();
        this.handSign = new HandSign();
        this.piles = new Piles(bird);
        this.pointBoard = new ScoreBoard();
        this.outX = window.innerWidth + 2000;

        this.hitArea = new Rectangle(0, 0, window.innerWidth, window.innerHeight);
        this.handSign.visible = false;
        this.pointBoard.visible = false;
        emitter.on('onResize', ({ width, height }) => {
            this.hitArea = new Rectangle(0, 0, width, height);
        });
        this.piles.x = this.outX;

        this.addChild(this.piles);
        this.addChild(this.handSign);
        this.addChild(this.pointBoard);
        emitter.on('onReset', () => {
            this.piles.init();
            this.pointBoard.reset();
        });
    }
    public show() {
        gsap.to(this.piles, {
            x: pileConfig.firstPileX,
            duration: 1,
            ease: 'power1.inOut',
            onComplete: () => {
                this.handSign.visible = true;
                this.pointBoard.visible = true;
                this.eventMode = 'static';
                this.cursor = 'pointer';
            },
        });
    }
    public hide() {
        gsap.to(this.piles, {
            x: this.outX,
            duration: 0.6,
            ease: 'back.in',
            onComplete: () => {
                this.handSign.visible = false;
                this.pointBoard.visible = false;
                this.eventMode = 'none';
                this.cursor = 'normal';
            },
        });
    }
}
export default GameContainer;
