import { emitter } from '../store/emitter';
import { scoreSingleton } from '../store/score';
import { CommonBoard } from '../ui/CommonBoard';
import { CommonButton } from '../ui/CommonButton';
import { CommonPopup } from '../ui/CommonPopup';
import { Sprite, Text } from 'pixi.js';
import { sfx } from '../utils/audio';

export class FinishPopup extends CommonPopup {
    private point: number;
    private mood: Sprite | null;
    private scoreText: CommonBoard | null;
    private hiScore: Text | null;
    private button: CommonButton | null;
    private button2: CommonButton | null;
    private buttonBack: CommonButton | null;
    private continueTimes: number = 1;
    constructor() {
        super();
        this.point = 0;
        this.mood = null;
        this.scoreText = null;
        this.hiScore = null;
        this.button = null;
        this.button2 = null;
        this.buttonBack = null;
        this.interactive = false;

        // emitter.on('onResize', ({ width, height }) => {
        //     // this.popLayout?.resize(width, height);
        //     // if (this.mood) {
        //     //     this.mood.width = (height / 6) * 1.24;
        //     //     this.mood.height = height / 6;
        //     // }
        //     // this.renderContent();
        // });

        emitter.on('onLoss', (status) => {
            if (status) {
                this.renderContent();
                this.show();
                emitter.emit('finishPopupIsShow', true);
            }
        });
        emitter.on('onReset', () => {
            this.hide();
            this.continueTimes = 1;
        });
        emitter.on('onBack', () => {
            this.hide();
            this.continueTimes = 1;
        });
        emitter.on('onContinue', () => {
            this.hide();
        });

        emitter.on('scoreChange', (score: number) => {
            this.point = score;
        });
    }
    private againPlay() {
        emitter.emit('onReset');
        emitter.emit('finishPopupIsShow', false);
    }

    private continuePlay() {
        emitter.emit('onContinue');
        emitter.emit('finishPopupIsShow', false);
    }

    private onContinueClick() {
        sfx.play('audio/click.wav');
        if (this.continueTimes > 0) {
            this.continuePlay();
            this.continueTimes -= 1;
        } else {
            try {
                emitter.emit('mute');

                const callbacks = {
                    adFinished: () => {
                        console.log('End rewarded ad');
                        this.continuePlay();
                        emitter.emit('recoverMute');
                    },
                    adError: (error: unknown) => {
                        console.log('Error rewarded ad', error);
                        this.againPlay();
                        emitter.emit('recoverMute');
                    },
                };
                window.CrazyGames.SDK.ad.requestAd('rewarded', callbacks);
            } catch (error) {
                console.log('Error rewarded ad', error);
                this.againPlay();
                emitter.emit('recoverMute');
            }
        }
    }
    private renderContent() {
        if (this.point > Number(scoreSingleton.hiScore)) {
            scoreSingleton.updateHiScore(this.point);
            try {
                window?.CrazyGames.SDK.game.happytime();
            } catch (err) {
                console.log('crazy fun time error', err);
            }
        }
        this.scoreText = new CommonBoard({
            label: String(this.point),
        });
        this.scoreText.x = this.width / 2;
        this.scoreText.y = this.height / 12;

        this.buttonBack = new CommonButton({
            text: '<',
            width: 60,
            height: 60,
            onPress: () => {
                sfx.play('audio/click.wav');
                emitter.emit('onBack');
                emitter.emit('finishPopupIsShow', false);
            },
        });
        this.buttonBack.x = this.width / 12;
        this.buttonBack.y = this.height / 8;

        this.button = new CommonButton({
            text: 'Again',
            onPress: () => {
                sfx.play('audio/click.wav');
                this.againPlay();
            },
        });

        this.button.width = this.width / 4;
        this.button.height = (this.width / 4) * 0.3;
        this.button.y = (this.height * 5) / 6;
        this.button.x = this.width / 4;

        const continueText = this.continueTimes === 0 ? 'Continue(🎞️)' : `Continue(${this.continueTimes})`;
        this.button2 = new CommonButton({
            text: continueText,
            onPress: () => {
                this.onContinueClick();
            },
        });
        this.button2.width = this.width / 4;
        this.button2.height = (this.width / 4) * 0.3;
        this.button2.y = (this.height * 5) / 6;
        this.button2.x = (this.width * 3) / 4;

        if (this.point > Number(scoreSingleton.hiScore)) {
            this.mood = Sprite.from('fly_piggy_win');
        } else if (this.point < Number(scoreSingleton.hiScore) / 2) {
            this.mood = Sprite.from('fly_piggy3');
        } else {
            this.mood = Sprite.from('fly_piggy1');
        }

        this.mood.width = (this.height / 4) * 1.24;
        this.mood.height = this.height / 4;
        this.mood.y = this.height / 4;
        this.mood.x = this.width / 2 - this.mood.width / 2;

        this.hiScore = new Text({
            text: `HighScore: ${scoreSingleton.hiScore}`,
            style: {
                fontFamily: 'Shrikhand',
                fill: 0xffffff,
            },
        });

        this.hiScore.y = this.height / 1.6;
        this.hiScore.x = this.width / 2 - this.hiScore.width / 2;

        this.addChild(this.buttonBack);
        this.addChild(this.scoreText);
        this.addChild(this.mood);
        this.addChild(this.hiScore);
        this.addChild(this.button);
        this.addChild(this.button2);
    }
}
