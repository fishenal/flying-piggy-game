import { AnimatedSprite, Texture } from 'pixi.js';
import { birdConfig, getBirdConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import gsap from 'gsap';

class Bird extends AnimatedSprite {
    private isPaused: boolean = true;
    public verSpeed: number;
    public status: 'start' | 'game' = 'start';
    public size: {
        x: number;
        y: number;
        w: number;
        h: number;
    } = {
        x: birdConfig.x,
        y: birdConfig.y,
        w: birdConfig.w,
        h: birdConfig.h,
    };
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
        emitter.on('onContinue', () => {
            gsap.killTweensOf(this);
            this.toGamePosition(() => {});
        });

        emitter.on('onResize', ({ width }) => {
            this.size.x = width / 8;
            this.size.w = width / 12;
            this.size.h = this.size.w * 0.8;
            if (this.status === 'game') {
                this.toGamePosition(() => {});
            }
            if (this.status === 'start') {
                this.toStartPosition(() => {});
            }
        });

        this.animationSpeed = 0.1;
        this.play();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.rotation = 0;
        this.verSpeed = getBirdConfig().intSpeed;
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

    public toStartPosition(onComplete: () => void) {
        gsap.to(this, {
            x: window.innerWidth / 4,
            y: window.innerHeight / 2,
            width: this.size.w * 2,
            height: this.size.h * 2,
            rotation: 25,
            duration: 0.6,
            ease: 'back.out',
            onComplete,
        });
        this.status = 'start';
    }
    public toGamePosition(onComplete: () => void) {
        gsap.to(this, {
            x: this.size.x,
            y: window.innerHeight / 4,
            width: this.size.w,
            height: this.size.h,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out',
            onComplete,
        });
        this.status = 'game';
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
