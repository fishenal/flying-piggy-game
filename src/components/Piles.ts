import { Container, NineSliceSprite, Sprite, Texture } from 'pixi.js';
import { getPileConfig, globalConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import { randomRange } from '../utils/random';
import Bird from './Bird';
import { scoreSingleton } from '../store/score';
import { sfx } from '../utils/audio';
import gsap from 'gsap';

class Pile extends Container {
    private randomPassPoint: number = 0;
    public passed: boolean;
    public yRange: number[];
    public idx: number;
    private pileShadow: Sprite;
    private pile1: NineSliceSprite;
    private pile2: NineSliceSprite;
    constructor(idx: number) {
        super();
        this.idx = idx;
        this.passed = false;
        this.yRange = [0, 0];
        this.randomPassPoint = randomRange(0.1, 0.6);
        emitter.on('onResize', () => {
            this.show();
        });

        this.pile1 = new NineSliceSprite({
            texture: Texture.from('pile_up'),
            bottomHeight: 45,
        });

        this.pile2 = new NineSliceSprite({
            texture: Texture.from('pile_down'),
            topHeight: 45,
        });

        this.pileShadow = Sprite.from('pile_shadow');

        this.addChild(this.pileShadow);
        this.addChild(this.pile1);
        this.addChild(this.pile2);
    }
    public show() {
        const pileHeight = (window.innerHeight * 5) / 6 + (window.innerHeight / 6) * 0.5;
        const pileWidth = getPileConfig().pileWidth;

        const pileGap = pileHeight * 0.3;

        this.position.y = 0;
        this.position.x = this.idx * getPileConfig().pileGap;

        this.yRange = [pileHeight * this.randomPassPoint, pileHeight * this.randomPassPoint + pileGap];

        this.pile1.width = pileWidth;
        this.pile1.x = 0;
        this.pile1.y = 0;
        this.pile1.height = pileHeight * this.randomPassPoint;

        this.pile2.x = 0;
        this.pile2.y = pileHeight * this.randomPassPoint + pileGap;
        this.pile2.width = pileWidth;
        this.pile2.height = pileHeight - this.randomPassPoint * pileHeight - pileGap;

        this.pileShadow.y = pileHeight;
        this.pileShadow.x = pileWidth * -1.4;
        this.pileShadow.width = pileWidth + pileWidth * 1.4;
        this.pileShadow.height = 150;
    }
}

class Piles extends Container {
    private isPaused: boolean = true;
    private bird: Bird;
    private initPileNum: number;
    private currentPileIdx: number;
    private outX: number;
    public onShowComplete: () => void = () => null;
    public onHideComplete: () => void = () => null;
    private pileWidth: number;
    constructor(bird: Bird) {
        super();
        this.pileWidth = getPileConfig().pileWidth;
        emitter.on('isPausedChange', (status) => {
            this.isPaused = status;
        });
        emitter.on('onReset', () => {
            this.show();
        });
        emitter.on('onBack', () => {
            this.hide();
        });
        emitter.on('onContinue', () => {
            this.onContinuePlay();
        });
        emitter.on('onResize', () => {
            this.pileWidth = getPileConfig().pileWidth;
        });
        this.outX = window.innerWidth + 2000;
        this.bird = bird;
        this.initPileNum = 0;
        this.currentPileIdx = 0;
        this.x = this.outX;

        this.onRender = () => {
            if (this.isPaused) {
                return;
            }
            this.position.x -= globalConfig.pileSpeed;
            const frontPile: Pile = this.getChildAt(0);
            const frontPileX = frontPile.getGlobalPosition().x;

            if (this.bird.position.y > frontPile.height * 0.8 - this.bird.height / 2) {
                this.onLoss();
            }
            if (
                frontPileX <= this.bird.position.x + this.bird.width / 2 &&
                frontPileX >= this.bird.x - this.pileWidth
            ) {
                if (
                    this.bird.position.y <= frontPile.yRange[0] + this.bird.height / 2 ||
                    this.bird.position.y >= frontPile.yRange[1] - this.bird.height / 2
                ) {
                    this.onLoss();
                }
            }
            if (!frontPile.passed && frontPileX <= this.bird.x - this.pileWidth) {
                frontPile.passed = true;
                this.onPass();
            }
            // frontPile leave stage
            if (frontPileX < -this.pileWidth) {
                this.removeChildAt(0);
                const newPile = new Pile(this.currentPileIdx);
                newPile.show();
                this.addChild(newPile);
                this.currentPileIdx += 1;
            }
        };
    }
    public onContinuePlay() {
        this.removeChildAt(0);
        const newPile = new Pile(this.currentPileIdx);
        newPile.show();
        this.addChild(newPile);
        this.currentPileIdx += 1;
    }
    public init() {
        this.removeChildren();
        this.initPileNum = 4;
        this.currentPileIdx = this.initPileNum + 1;
        for (let i = 0; i < this.initPileNum + 1; i++) {
            const p = new Pile(i);
            p.show();
            this.addChild(p);
        }
        this.x = this.outX;
    }
    public onLoss() {
        emitter.emit('isPausedChange', true);
        emitter.emit('onLoss', true);
        sfx.play('audio/hit.wav');
    }
    public onPass() {
        sfx.play('audio/pass.wav');
        scoreSingleton.count();
    }
    public show() {
        this.init();
        gsap.to(this, {
            x: getPileConfig().firstPileX,
            duration: 1,
            ease: 'power1.inOut',
            onComplete: this.onShowComplete,
        });
    }
    public hide() {
        gsap.to(this, {
            x: this.outX,
            duration: 0.6,
            ease: 'back.in',
            onComplete: this.onHideComplete,
        });
    }
}
export default Piles;
