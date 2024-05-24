import { Container } from 'pixi.js';
import { emitter } from '../store/emitter';
import Bird from '../components/Bird';
import { FinishPopup } from '../components/FinishPopup';
import { Background, Cloud, Ground } from '../components/Background';
import StartScreen from './StartScreen';
import GameContainer from './GameContainer';
import { getBirdConfig } from '../utils/config';
import { bgm, sfx } from '../utils/audio';
import { VolControl } from '../components/VolControl';
import IndicatorCover from './IndicatorCover';
import { scoreSingleton } from '../store/score';

class GameScreen extends Container {
    private popupIsShow: boolean;
    private bird: Bird;
    constructor() {
        super();
        this.popupIsShow = false;
        bgm.play('audio/piggybgm.mp3', { volume: 0.6 });
        emitter.on('finishPopupIsShow', (status) => {
            this.popupIsShow = status;
        });
        emitter.on('onResize', () => {
            if (this.bird.status === 'start') {
                this.bird.toStartPosition(() => {});
            } else {
                this.bird.toGamePosition(() => {});
            }
        });
        scoreSingleton.init();
        this.bird = new Bird();

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
            this.bird.verSpeed = getBirdConfig().intSpeed;
        });
        this.addChild(gameContainer);
        const indicator = new IndicatorCover();
        const startScreen = new StartScreen();
        startScreen.show();
        startScreen.onStartClick = () => {
            window.CrazyGames.SDK.game.gameplayStart();
            this.bird.toGamePosition(() => {
                gameContainer.piles.show();
                indicator.show();
            });
            startScreen.hide();
        };
        this.addChild(startScreen);

        this.addChild(this.bird);
        this.addChild(finishPopup);

        const volButton = new VolControl();
        this.addChild(volButton);

        this.addChild(indicator);

        emitter.on('onReset', () => {
            emitter.emit('isPausedChange', true);
            this.bird.toGamePosition(() => {});
        });

        emitter.on('onBack', () => {
            window.CrazyGames.SDK.game.gameplayStop();
            this.bird.toStartPosition(() => {
                startScreen.show();
            });
        });
    }
}

export default GameScreen;
