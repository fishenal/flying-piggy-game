import { Container } from 'pixi.js';
import { emitter } from '../store/emitter';
import Bird from '../components/Bird';
import { HandSign, ScoreBoard } from '../components/Hub';
import Piles from '../components/Piles';
import { FinishPopup } from '../components/FinishPopup';
import { Background, Cloud, Ground } from '../components/Background';
import { app } from '../main';

class GameScreen extends Container {
    constructor() {
        super();

        this.eventMode = 'auto';

        const bird = new Bird();
        const background = new Background(bird);
        const ground = new Ground();
        const cloud = new Cloud();
        const handSign = new HandSign();
        const piles = new Piles(bird);
        const pointBoard = new ScoreBoard();
        const finishPopup = new FinishPopup();
        this.addChild(background);
        this.addChild(cloud);
        this.addChild(ground);
        this.addChild(bird);
        this.addChild(handSign);
        this.addChild(piles);
        this.addChild(pointBoard);
        this.addChild(finishPopup);

        emitter.on('onReset', () => {
            emitter.emit('isPausedChange', true);
            bird.init();
            piles.init();
            pointBoard.reset();
            finishPopup.reset();
            finishPopup.hide();
            app.start();
        });
    }
}

export default GameScreen;
