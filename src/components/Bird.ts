import { AnimatedSprite, Texture } from 'pixi.js';
import { birdConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import gsap from 'gsap';

class Bird extends AnimatedSprite {
    private isPaused: boolean = true;
    public verSpeed: number = birdConfig.intSpeed;
    constructor() {
        super([Texture.from('fly_piggy1'), Texture.from('fly_piggy2')]);
        this.anchor = 0.5;
        emitter.on('isPausedChange', (status) => {
            this.isPaused = status;
        });
        emitter.on('onLoss', (status) => {
            if (status) {
                this.onDie();
            }
        });
        emitter.on('onReset', () => {
            gsap.killTweensOf(this);
        });
        emitter.on('onBack', () => {
            gsap.killTweensOf(this);
        });
        this.animationSpeed = 0.1;
        this.play();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        // this.width = birdConfig.w;
        // this.height = birdConfig.h;
        this.init();
        this.onRender = () => {
            if (this.isPaused) return;
            this.position.y -= this.verSpeed;
            this.verSpeed -= birdConfig.downRate;
            if (this.verSpeed > -3) {
                if (this.rotation < -Math.PI / 8) {
                    this.rotation = -Math.PI / 8;
                } else {
                    this.rotation -= Math.PI / 180;
                }
            } else {
                if (this.rotation > Math.PI / 2) {
                    this.rotation = Math.PI / 2;
                } else {
                    this.rotation += Math.PI / 120;
                }
            }
        };
    }
    public init() {
        this.position.x = birdConfig.x;
        this.position.y = birdConfig.y;
        this.rotation = 0;
        this.verSpeed = birdConfig.intSpeed;
    }
    public toStartPosition(onComplete: () => void) {
        gsap.to(this, {
            x: window.innerWidth / 4,
            y: window.innerHeight / 2,
            width: birdConfig.w * 2,
            height: birdConfig.h * 2,
            rotation: 25,
            duration: 0.6,
            ease: 'back.out',
            onComplete,
        });
    }
    public toGamePosition(onComplete: () => void) {
        gsap.to(this, {
            x: birdConfig.x,
            y: birdConfig.y,
            width: birdConfig.w,
            height: birdConfig.h,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out',
            onComplete,
        });
    }
    private onDie() {
        gsap.to(this, {
            rotation: 16,
            duration: 2,
            repeatDelay: 0.5,
            repeat: -1,
            yoyo: true,
        });
    }
}

export default Bird;
