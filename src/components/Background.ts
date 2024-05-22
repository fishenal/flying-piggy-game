import { Container, Sprite, Texture, TilingSprite } from 'pixi.js';
import { globalConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import gsap from 'gsap';

export class Background extends Container {
    private bg: Sprite;
    constructor() {
        super();
        const bg1 = Texture.from('bg');
        const bg2 = Texture.from('bg2');
        const bg3 = Texture.from('bg3');
        const bg4 = Texture.from('bg4');
        const bg5 = Texture.from('bg5');
        emitter.on('onResize', ({ width, height }) => {
            this.bg.width = width;
            this.bg.height = height;
        });
        emitter.on('onBack', () => {
            this.bg.texture = bg1;
        });
        emitter.on('onReset', () => {
            this.bg.texture = bg1;
        });
        emitter.on('scoreChange', (score: number) => {
            if (score >= 200) {
                this.bg.texture = bg5;
            } else if (score >= 100) {
                this.bg.texture = bg4;
            } else if (score >= 50) {
                this.bg.texture = bg3;
            } else if (score >= 20) {
                this.bg.texture = bg2;
            } else {
                this.bg.texture = bg1;
            }
        });

        this.bg = new Sprite(bg1);
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight - globalConfig.groundHeight;
        this.addChild(this.bg);
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
        const cloud1 = Texture.from('cloud');
        const cloud2 = Texture.from('cloud2');
        const cloud3 = Texture.from('cloud3');
        emitter.on('onBack', () => {
            this.cloud.texture = cloud1;
        });
        emitter.on('onReset', () => {
            this.cloud.texture = cloud1;
        });
        emitter.on('scoreChange', (score: number) => {
            if (score >= 100) {
                this.cloud.texture = cloud3;
            } else if (score >= 50) {
                this.cloud.texture = cloud2;
            } else {
                this.cloud.texture = cloud1;
            }
        });

        emitter.on('onResize', ({ width, height }) => {
            this.cloud.width = width;
            this.cloud.y = height - globalConfig.groundHeight - 150;
            this.flow();
        });
        this.cloud = new TilingSprite({
            texture: cloud1,
            width: window.innerWidth,
            height: 195,
            x: 0,
            y: window.innerHeight - globalConfig.groundHeight - 150,
            tileScale: { x: 0.5, y: 0.5 },
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
        flow.to(this.cloud, { y: this.cloud.y - 35, ease: 'linear', duration: 4 });
        flow.to(this.cloud, { y: this.cloud.y, ease: 'linear', duration: 4 });
    }
}
