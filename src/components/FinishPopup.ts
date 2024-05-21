import { emitter } from '../store/emitter';
import { scoreSingleton } from '../store/score';
import { CommonBoard } from '../ui/CommonBoard';
import { CommonButton } from '../ui/CommonButton';
import { CommonPopup } from '../ui/CommonPopup';
import { Sprite, Text } from 'pixi.js';
import { Layout } from '@pixi/layout';

export class FinishPopup extends CommonPopup {
    private point: number;
    private hiScore: string;
    private mood: Sprite | null;
    private popLayout: Layout | null;
    private scoreText: CommonBoard | null;
    private button: CommonButton | null;
    private button2: CommonButton | null;
    constructor() {
        super();
        this.point = 0;
        this.hiScore = scoreSingleton.hiScore;
        this.mood = null;
        this.popLayout = null;
        this.scoreText = null;
        this.button = null;
        this.button2 = null;
        this.interactive = false;
        this.onResize = ({ width, height }) => {
            this.width = width;
            this.height = height;
            this.popLayout?.resize(width, height);
        };
        emitter.on('onLoss', (status) => {
            if (status) {
                this.reset();
                this.renderContent();
                this.show();
            }
        });
        emitter.on('scoreChange', (score: number) => {
            this.point = score;
        });
    }
    public reset() {
        if (this.popLayout) {
            this.popLayout.destroy();
        }
    }
    private renderContent() {
        if (this.point > Number(this.hiScore)) {
            scoreSingleton.updateHiScore(this.point);
        }
        this.scoreText = new CommonBoard({
            label: String(this.point),
            width: 200,
            height: 60,
            padding: 10,
        });
        this.button = new CommonButton({
            label: 'Again',
            size: 'lg',
        });
        this.button.onclick = (e) => {
            e?.stopPropagation();
            emitter.emit('onReset');
        };

        this.button2 = new CommonButton({
            label: 'Continue',
            size: 'lg',
        });
        this.button2.onclick = (e) => {
            e?.stopPropagation();
            console.log('continue play');
            // emitter.emit('onReset');
        };
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
                scoreText: {
                    content: this.scoreText,
                    styles: {
                        position: 'centerTop',
                        height: '20%',
                        paddingTop: 50,
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
                            content: this.button,
                        },
                        {
                            content: this.button2,
                            styles: {
                                paddingLeft: 20,
                            },
                        },
                    ],
                    styles: {
                        position: 'centerBottom',
                        height: '25%',
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
