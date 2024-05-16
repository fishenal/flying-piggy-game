import { emitter } from '../store/emitter';
import { scoreSingleton } from '../store/score';
import { CommonButton } from '../ui/CommonButton';
import { CommonPopup } from '../ui/CommonPopup';
import { Container, Text } from 'pixi.js';

export class FinishPopup extends CommonPopup {
    private point: number;
    private hiScore: string;
    private mood: string;
    private container: Container;
    constructor() {
        super();
        this.point = 0;
        this.hiScore = scoreSingleton.hiScore;
        this.mood = 'normal';
        this.interactive = false;
        this.container = new Container();
        this.addChild(this.container);
        this.renderButton();
        emitter.on('onLoss', (status) => {
            if (status) {
                this.container.removeChildren();
                this.show();
                this.renderScore();
                this.updateHiScore();
                this.renderHiScore();
                this.updateMood();
                this.renderMood();
            }
        });
        emitter.on('scoreChange', (score: number) => {
            this.point = score;
        });
    }
    public reset() {
        this.container.removeChildren();
    }
    private renderButton() {
        const button = new CommonButton('Try Again!');
        button.x = this.width / 2 - button.width / 2;
        button.y = (this.height * 2) / 3;
        button.onPress.connect((_, e) => {
            e?.stopPropagation();
            emitter.emit('onReset');
        });
        this.addChild(button);
    }
    private renderScore() {
        const scoreText = new Text({ text: String(this.point) });

        this.container.addChild(scoreText);
    }
    private renderMood() {
        const mood = new Text({ text: this.mood });
        mood.y = 150;
        this.container.addChild(mood);
    }
    private updateMood() {
        if (this.point > Number(this.hiScore)) {
            this.mood = 'happy';
        }
        if (this.point < Number(this.hiScore) / 2) {
            this.mood = 'sad';
        }
    }
    private updateHiScore() {
        if (this.point > Number(this.hiScore)) {
            scoreSingleton.updateHiScore(this.point);
        }
    }
    private renderHiScore() {
        const hiScoreText = new Text({ text: scoreSingleton.hiScore });
        hiScoreText.y = this.height / 2;
        this.container.addChild(hiScoreText);
    }
}
