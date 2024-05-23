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
    private hiScore: string;
    private mood: Sprite | null;
    private popLayout: Layout | null;
    private scoreText: CommonBoard | null;
    private button: CommonButton | null;
    private button2: CommonButton | null;
    private buttonBack: CommonButton | null;
    constructor() {
        super();
        this.point = 0;
        this.hiScore = scoreSingleton.hiScore;
        this.mood = null;
        this.popLayout = null;
        this.scoreText = null;
        this.button = null;
        this.button2 = null;
        this.buttonBack = null;
        this.interactive = false;
        this.button = new CommonButton({
            text: 'Again',
            onPress: () => {
                sfx.play('audio/click.wav');
                emitter.emit('onReset');
                emitter.emit('finishPopupIsShow', false);
            },
        });

        this.button2 = new CommonButton({
            text: 'Continue',
            onPress: () => {
                sfx.play('audio/click.wav');
                emitter.emit('onContinue');
                emitter.emit('finishPopupIsShow', false);
            },
        });

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
        this.onResize = ({ width, height }) => {
            this.width = width;
            this.height = height;
            this.popLayout?.resize(width, height);
        };

        emitter.on('onLoss', (status) => {
            if (status) {
                this.renderContent();
                this.show();
                emitter.emit('finishPopupIsShow', true);
            }
        });
        emitter.on('onReset', () => {
            this.hide();
        });
        emitter.on('onBack', () => {
            this.hide();
        });
        emitter.on('onContinue', () => {
            this.hide();
        });

        emitter.on('scoreChange', (score: number) => {
            this.point = score;
        });
    }

    private renderContent() {
        if (this.popLayout) {
            this.removeChild(this.popLayout);
        }

        if (this.point > Number(this.hiScore)) {
            scoreSingleton.updateHiScore(this.point);
        }
        this.scoreText = new CommonBoard({
            label: String(this.point),
        });

        if (this.point > Number(this.hiScore)) {
            this.mood = Sprite.from('fly_piggy_win');
        } else if (this.point < Number(this.hiScore) / 2) {
            this.mood = Sprite.from('fly_piggy3');
        } else {
            this.mood = Sprite.from('fly_piggy1');
        }

        this.mood.width = 200;
        this.mood.height = 200 / 1.24;

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
                        paddingTop: 50,
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
                        height: '15%',
                    },
                },
            },
            styles: {
                padding: 150,
                width: '100%',
                height: '100%',
            },
        });
        this.popLayout.resize(this.width, this.height);
        this.addChild(this.popLayout);
    }
}
