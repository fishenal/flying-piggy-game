import { Container, Sprite } from 'pixi.js';
import { CommonButton } from '../ui/CommonButton';
import { emitter } from '../store/emitter';
import gsap from 'gsap';
import { sfx } from '../utils/audio';
class StartScreen extends Container {
    private title: Sprite;
    private startButton: CommonButton;
    private logo: Sprite;
    private outX: number;
    public onStartClick: () => void;
    constructor() {
        super();
        this.onStartClick = () => {};
        this.title = Sprite.from('title');
        this.outX = window.innerWidth + 1500;
        emitter.on('onResize', ({ width, height }) => {
            this.title.width = width;
            this.title.height = (width * 371) / 1954;
            this.title.y = height / 5;
            this.startButton.width = width / 4;
            this.startButton.height = this.startButton.width / 3;
            this.startButton.y = (height * 2) / 3;
            this.logo.x = width - 160;
            this.logo.y = height - 130;
            if (this.visible) {
                this.show();
            }
        });
        this.title.x = this.outX;

        this.addChild(this.title);

        this.startButton = new CommonButton({
            text: 'Start',
            radius: 15,
            onPress: () => {
                sfx.play('audio/click.wav');
                this.hide();
                this.onStartClick();
            },
        });
        this.startButton.pivot.x = this.startButton.width / 2;
        this.startButton.x = this.outX;

        this.addChild(this.startButton);

        this.logo = Sprite.from('fishenalLogo');
        this.logo.width = 147;
        this.logo.height = 107;
        this.logo.x = window.innerWidth - 160;
        this.logo.y = window.innerHeight - 130;
        this.addChild(this.logo);
    }
    public show() {
        this.visible = true;
        this.startButton.visible = true;
        gsap.to(this.title, {
            x: 0,
            duration: 0.6,
            ease: 'back.out',
        });
        gsap.to(this.startButton, {
            x: window.innerWidth / 2 + this.startButton.width / 2,
            duration: 0.8,
            ease: 'power2.out',
        });
        this.logo.visible = true;
    }
    public hide() {
        this.visible = false;
        gsap.to(this.title, {
            x: this.outX * -1,
            duration: 0.6,
            ease: 'back.in',
        });
        gsap.to(this.startButton, {
            x: this.outX * -1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                this.startButton.visible = false;
            },
        });

        this.logo.visible = false;
    }
}
export default StartScreen;
