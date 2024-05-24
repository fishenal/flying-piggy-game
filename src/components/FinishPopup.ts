import { emitter } from '../store/emitter';
import { scoreSingleton } from '../store/score';
import { CommonBoard } from '../ui/CommonBoard';
import { CommonButton } from '../ui/CommonButton';
import { CommonPopup } from '../ui/CommonPopup';
import { Container, Sprite, Text } from 'pixi.js';
import { Layout } from '@pixi/layout';
import { sfx } from '../utils/audio';

export class FinishPopup extends CommonPopup {
    private point: number;
    private mood: Sprite | null;
    private popLayout: Layout | null;
    private scoreText: CommonBoard | null;
    private button: CommonButton | null;
    private button2: CommonButton | null;
    private buttonBack: CommonButton | null;
    private continueTimes: number = 1;
    constructor() {
        super();
        this.point = 0;
        this.mood = null;
        this.popLayout = null;
        this.scoreText = null;
        this.button = null;
        this.button2 = null;
        this.buttonBack = null;
        this.interactive = false;

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
        emitter.on('onResize', ({ width, height }) => {
            this.popLayout?.resize(width / 1.5, height / 1.5);
            if (this.mood) {
                this.mood.width = (height / 6) * 1.24;
                this.mood.height = height / 6;
            }
        });

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
                const callbacks = {
                    adFinished: () => {
                        console.log('End rewarded ad');
                        this.continuePlay();
                    },
                    adError: (error: unknown) => {
                        console.log('Error rewarded ad', error);
                        this.againPlay();
                    },
                };
                window.CrazyGames.SDK.ad.requestAd('rewarded', callbacks);
            } catch (error) {
                console.log('Error rewarded ad', error);
                this.againPlay();
            }
        }
    }
    private renderContent() {
        if (this.popLayout) {
            this.removeChild(this.popLayout);
        }
        if (this.point > Number(scoreSingleton.hiScore)) {
            try {
                window?.CrazyGames.SDK.game.happytime();
            } catch (err) {
                console.log('crazy fun time error', err);
            }
            scoreSingleton.updateHiScore(this.point);
        }
        this.scoreText = new CommonBoard({
            label: String(this.point),
        });

        this.button = new CommonButton({
            text: 'Again',
            onPress: () => {
                sfx.play('audio/click.wav');
                this.againPlay();
            },
        });
        const continueText = this.continueTimes === 0 ? 'Continue(🎞️)' : `Continue(${this.continueTimes})`;
        this.button2 = new CommonButton({
            text: continueText,
            onPress: () => {
                this.onContinueClick();
            },
        });

        if (this.point > Number(scoreSingleton.hiScore)) {
            this.mood = Sprite.from('fly_piggy_win');
        } else if (this.point < Number(scoreSingleton.hiScore) / 2) {
            this.mood = Sprite.from('fly_piggy3');
        } else {
            this.mood = Sprite.from('fly_piggy1');
        }

        this.mood.width = (this.height / 4) * 1.24;
        this.mood.height = this.height / 4;

        this.popLayout = new Layout({
            id: 'finishPopup',
            content: {
                backButton: {
                    content: this.buttonBack as Container,
                    styles: {
                        position: 'leftTop',
                        paddingTop: 50,
                        paddingLeft: 50,
                    },
                },
                scoreText: {
                    id: 'scoreText',
                    content: this.scoreText,
                    styles: {
                        position: 'centerTop',
                        height: '20%',
                        paddingTop: 25,
                        paddingLeft: 100,
                    },
                },
                mood: {
                    content: [
                        {
                            content: this.mood,
                            styles: {
                                position: 'centerTop',
                                height: '50%',
                            },
                        },
                        {
                            content: new Text({
                                text: `HighScore: ${scoreSingleton.hiScore}`,
                                style: {
                                    fontFamily: 'Shrikhand',
                                    fill: 0xffffff,
                                },
                            }),
                            styles: {
                                position: 'centerBottom',
                                height: '50%',
                            },
                        },
                    ],
                    styles: {
                        position: 'center',
                        height: '50%',
                        aspectRatio: 'flex',
                    },
                },
                button: {
                    content: [
                        {
                            content: this.button as Container,
                        },
                        {
                            content: this.button2 as Container,
                            styles: {
                                paddingLeft: 20,
                            },
                        },
                    ],
                    styles: {
                        position: 'centerBottom',
                        paddingLeft: 190,
                        height: '25%',
                    },
                },
            },
            styles: {
                padding: this.height / 12,
                width: '100%',
                height: '100%',
            },
        });
        this.popLayout.resize(this.width, this.height);
        this.addChild(this.popLayout);
    }
}
