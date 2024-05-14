import { AnimatedSprite, Texture } from 'pixi.js';
import { birdConfig } from '../utils/config';
import { emitter } from '../store/emitter';

class Bird extends AnimatedSprite {
    private isPaused: boolean = true;
    public verSpeed: number = birdConfig.intSpeed;
    constructor() {
        super([Texture.from('bird'), Texture.from('bird2')]);
        emitter.on('isPausedChange', (status) => {
            this.isPaused = status;
        });
        this.animationSpeed = 0.1;
        this.play();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.width = birdConfig.w;
        this.height = birdConfig.h;
        this.position.x = birdConfig.x;
        this.position.y = birdConfig.y;
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
}

export default Bird;
