import { Container, Sprite } from 'pixi.js';
import { CommonButton } from '../ui/CommonButton';
import { emitter } from '../store/emitter';
import gsap from 'gsap';
class StartScreen extends Container {
    private title: Sprite;
    private startButton: CommonButton;
    private startButtonX: number;
    private outX: number;
    public onStartClick: () => void;
    constructor() {
        super();
        this.onStartClick = () => {};
        this.title = Sprite.from('title');
        this.outX = window.innerWidth + 500;
        emitter.on('onResize', ({ width, height }) => {
            this.title.width = width;
            this.title.height = (width * 371) / 1954;
            this.title.y = height / 5;
            this.startButton.x = width / 2 + this.startButton.width / 2;
        });
        this.title.width = window.innerWidth;
        this.title.height = (window.innerWidth * 371) / 1954;
        this.title.x = this.outX;
        this.title.y = window.innerHeight / 5;

        this.addChild(this.title);

        this.startButton = new CommonButton({
            text: 'Start',
            onPress: () => {
                this.hide();
                this.onStartClick();
            },
        });
        this.startButtonX = window.innerWidth / 2 + this.startButton.width / 2;
        this.startButton.pivot.x = this.startButton.width / 2;
        this.startButton.x = this.outX;
        this.startButton.y = (window.innerHeight * 2) / 3;
        this.addChild(this.startButton);
    }
    public show() {
        gsap.to(this.title, {
            x: 0,
            duration: 0.6,
            ease: 'back.out',
        });
        gsap.to(this.startButton, {
            x: this.startButtonX,
            duration: 0.8,
            ease: 'power2.out',
        });
    }
    public hide() {
        gsap.to(this.title, {
            x: this.outX * -1,
            duration: 0.6,
            ease: 'back.in',
        });
        gsap.to(this.startButton, {
            x: this.outX * -1,
            duration: 0.8,
            ease: 'power2.out',
        });
    }
}
export default StartScreen;
