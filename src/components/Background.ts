import { Container, Sprite, TilingSprite } from 'pixi.js';
import { birdConfig, globalConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import Bird from './Bird';
import gsap from 'gsap';

export class Background extends Container {
    private bird: Bird;
    private bg: Sprite;
    constructor(bird: Bird) {
        super();
        emitter.on('onResize', ({ width, height }) => {
            this.bg.width = width;
            this.bg.height = height;
        });
        this.bird = bird;
        this.bg = Sprite.from('bg');
        this.bg.interactive = true;
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight - globalConfig.groundHeight;
        this.bg.cursor = 'pointer';
        this.addChild(this.bg);
        this.bg.on('pointerdown', () => {
            emitter.emit('isPausedChange', false);
            this.bird.verSpeed = birdConfig.intSpeed;
        });
    }
}

export class Ground extends Container {
    private isPaused: boolean = true;
    private ground: TilingSprite;
    constructor() {
        super();
        emitter.on('onResize', ({ width, height }) => {
            this.ground.y = height - globalConfig.groundHeight - 40;
            this.ground.width = width;
        });
        this.ground = TilingSprite.from('ground', {
            width: window.innerWidth,
            height: globalConfig.groundHeight + 40,
            x: 0,
            y: window.innerHeight - globalConfig.groundHeight - 40,
            tileScale: { x: 0.5, y: 0.5 },
        });
        this.ground.onRender = () => {
            if (this.isPaused) {
                return;
            }
            this.ground.tilePosition.x -= globalConfig.pileSpeed - 2;
        };
        this.addChild(this.ground);
    }
}

export class Cloud extends Container {
    private cloud: TilingSprite;
    constructor() {
        super();
        emitter.on('onResize', ({ width, height }) => {
            this.cloud.width = width;
            this.cloud.y = height - globalConfig.groundHeight - 150;
            this.flow();
        });
        this.cloud = TilingSprite.from('cloud', {
            width: window.innerWidth,
            height: 195,
            x: 0,
            y: window.innerHeight - globalConfig.groundHeight - 150,
            tileScale: { x: 0.4, y: 0.4 },
        });
        this.flow();
        this.addChild(this.cloud);
    }
    private flow() {
        gsap.killTweensOf(this.cloud);
        const flow = gsap.timeline({
            repeat: -1,
            yoyo: true,
        });
        flow.to(this.cloud, { y: this.cloud.y - 45, ease: 'linear', duration: 4 });
        flow.to(this.cloud, { y: this.cloud.y, ease: 'linear', duration: 4 });
    }
}
