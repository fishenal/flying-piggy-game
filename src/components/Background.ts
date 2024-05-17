import { Container, Sprite, TilingSprite } from 'pixi.js';
import { birdConfig, globalConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import Bird from './Bird';
import gsap from 'gsap';

export class Background extends Container {
    private bird: Bird;
    constructor(bird: Bird) {
        super();
        this.bird = bird;
        const bg = Sprite.from('bg');
        bg.interactive = true;
        bg.width = window.innerWidth;
        bg.height = window.innerHeight - globalConfig.groundHeight;
        bg.cursor = 'pointer';
        this.addChild(bg);
        bg.on('pointerdown', () => {
            emitter.emit('isPausedChange', false);
            this.bird.verSpeed = birdConfig.intSpeed;
        });
    }
}

export class Ground extends Container {
    private isPaused: boolean = true;
    constructor() {
        super();
        const fb = TilingSprite.from('ground', {
            width: window.innerWidth,
            height: globalConfig.groundHeight + 40,
            x: 0,
            y: window.innerHeight - globalConfig.groundHeight - 40,
            tileScale: { x: 0.5, y: 0.5 },
        });
        fb.onRender = () => {
            if (this.isPaused) {
                return;
            }
            fb.tilePosition.x -= globalConfig.pileSpeed - 2;
        };
        this.addChild(fb);
    }
}

export class Cloud extends Container {
    constructor() {
        super();
        const cloud = TilingSprite.from('cloud', {
            width: window.innerWidth,
            height: 195,
            x: 0,
            y: window.innerHeight - globalConfig.groundHeight - 150,
            tileScale: { x: 0.4, y: 0.4 },
        });
        const flow = gsap.timeline({
            repeat: -1,
            yoyo: true,
        });
        flow.to(cloud, { y: window.innerHeight - globalConfig.groundHeight - 195, ease: 'linear', duration: 4 });
        flow.to(cloud, { y: window.innerHeight - globalConfig.groundHeight - 150, ease: 'linear', duration: 4 });
        this.addChild(cloud);
    }
}
