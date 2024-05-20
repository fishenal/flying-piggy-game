import { emitter } from '../store/emitter';
import { scoreSingleton } from '../store/score';
import { CommonBoard } from '../ui/CommonBoard';
import { CommonButton } from '../ui/CommonButton';
import { CommonPopup } from '../ui/CommonPopup';
import { Container, Sprite, Text } from 'pixi.js';

export class FinishPopup extends CommonPopup {
    private point: number;
    private hiScore: string;
    private mood: Sprite | null;
    private container: Container;
    private gap: number = 10;
    constructor() {
        super();
        this.point = 0;
        this.hiScore = scoreSingleton.hiScore;
        this.mood = null;
        this.interactive = false;
        // this.width = 600;
        // this.height = 600;
        // this.x = 0;
        // this.y = 0;
        this.container = new Container();
        this.addChild(this.container);
        this.renderButton();
        emitter.on('onLoss', (status) => {
            if (status) {
                this.container.removeChildren();
                this.show();
                this.renderScore();
                this.renderHiScore();
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

    private renderScore() {
        const scoreText = new CommonBoard({
            label: String(this.point),
            width: 100,
            height: 60,
            padding: 10,
        });
        scoreText.x = this.width / 2 - scoreText.width / 2;
        scoreText.y = 50;
        this.container.addChild(scoreText);
    }
    private renderMood() {
        if (this.point > Number(this.hiScore)) {
            this.mood = Sprite.from('fly_piggy_win');
        } else if (this.point < Number(this.hiScore) / 2) {
            this.mood = Sprite.from('fly_piggy3');
        } else {
            this.mood = Sprite.from('fly_piggy1');
        }

        this.mood.width = 100;
        this.mood.height = 100 / 1.24;
        this.mood.x = this.width / 2 - this.mood.width / 2;
        this.mood.y = 50 + 60 + this.gap;
        // this.mood.anchor = 0.5;
        // this.mood.scale = 0.5;
        this.container.addChild(this.mood);
    }
    private renderHiScore() {
        if (this.point > Number(this.hiScore)) {
            scoreSingleton.updateHiScore(this.point);
        }
        const hiScoreText = new Text({
            text: `HighScore: ${scoreSingleton.hiScore}`,
            style: {
                fontFamily: 'Shrikhand',
                fill: 0xffffff,
            },
        });
        hiScoreText.x = this.width / 2 - hiScoreText.width / 2;
        hiScoreText.y = 50 + 60 + 100 / 1.24 + this.gap;
        this.container.addChild(hiScoreText);
    }
    private renderButton() {
        const button = new CommonButton({
            label: 'Again',
            size: 'lg',
        });
        button.x = this.width / 2 - button.width / 2;
        button.y = 50 + 60 + 100 / 1.24 + this.gap + 50;
        button.onclick = (e) => {
            e?.stopPropagation();
            emitter.emit('onReset');
        };
        this.addChild(button);
    }
}
