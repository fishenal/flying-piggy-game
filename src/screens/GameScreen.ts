import { Container } from 'pixi.js';
import { emitter } from '../store/emitter';
import Bird from '../components/Bird';
import { FinishPopup } from '../components/FinishPopup';
import { Background, Cloud, Ground } from '../components/Background';
import StartScreen from './StartScreen';
import GameContainer from './GameContainer';
import { birdConfig } from '../utils/config';
import { sfx } from '../utils/audio';

class GameScreen extends Container {
    private popupIsShow: boolean;
    private bird: Bird;
    constructor() {
        super();
        this.popupIsShow = false;
        emitter.on('finishPopupIsShow', (status) => {
            this.popupIsShow = status;
        });
        emitter.on('onResize', ({ width, height }) => {
            this.bird.x = width / 4;
            this.bird.height = height / 4;
        });
        this.bird = new Bird();
        this.bird.width = birdConfig.w * 2;
        this.bird.height = birdConfig.h * 2;
        this.bird.x = window.innerWidth / 4;
        this.bird.y = window.innerHeight / 2;
        this.bird.rotation = 25;
        const background = new Background();
        const ground = new Ground();
        const cloud = new Cloud();

        const finishPopup = new FinishPopup();
        this.addChild(background);
        this.addChild(cloud);
        this.addChild(ground);

        const gameContainer = new GameContainer(this.bird);
        gameContainer.eventMode = 'none';
        gameContainer.on('pointerdown', () => {
            if (this.popupIsShow) {
                return;
            }
            sfx.play('audio/swing.wav');
            emitter.emit('isPausedChange', false);
            this.bird.verSpeed = birdConfig.intSpeed;
        });
        this.addChild(gameContainer);

        const startScreen = new StartScreen();
        startScreen.show();
        startScreen.onStartClick = () => {
            this.bird.toGamePosition(() => {
                gameContainer.show();
            });
        };
        this.addChild(startScreen);

        this.addChild(finishPopup);
        this.addChild(this.bird);

        emitter.on('onReset', () => {
            emitter.emit('isPausedChange', true);
            this.bird.init();
            finishPopup.reset();
            finishPopup.hide();
        });

        emitter.on('onBack', () => {
            gameContainer.hide();
            this.bird.toStartPosition(() => {
                startScreen.show();
            });
        });
    }
}

export default GameScreen;
