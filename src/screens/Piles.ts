import { Container, NineSliceSprite, Sprite, Texture } from 'pixi.js';
import { birdConfig, globalConfig, pileConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import { randomRange } from '../utils/random';
import Bird from './Bird';
import { scoreSingleton } from '../store/score';

class Pile extends Container {
    private randomPassPoint: number = 0;
    public crossingBird: boolean;
    public yRange: number[];
    public idx: number;
    constructor(idx: number) {
        super();
        this.idx = idx;
        this.crossingBird = false;
        this.yRange = [0, 0];
        const pileHeight = window.innerHeight - globalConfig.groundHeight;
        this.width = pileConfig.pileWidth;
        this.height = pileHeight;
        this.position.y = 0;
        this.position.x = idx * pileConfig.pileGap;

        this.randomPassPoint = randomRange(0, pileHeight - pileConfig.gapHeight + 1);
        this.yRange = [this.randomPassPoint, this.randomPassPoint + pileConfig.gapHeight];

        const pile1 = new NineSliceSprite({
            texture: Texture.from('pile_up'),
            bottomHeight: 45,
        });
        pile1.width = pileConfig.pileWidth;
        pile1.x = 0;
        pile1.y = 0;
        pile1.height = this.randomPassPoint;

        const pile2 = new NineSliceSprite({
            texture: Texture.from('pile_down'),
            topHeight: 45,
        });
        pile2.x = 0;
        pile2.y = this.randomPassPoint + pileConfig.gapHeight;
        pile2.width = pileConfig.pileWidth;
        pile2.height = pileHeight - this.randomPassPoint - pileConfig.gapHeight;

        const pileShadow = Sprite.from('pile_shadow');
        pileShadow.y = pileHeight;
        pileShadow.x = -135;
        pileShadow.width = pileConfig.pileWidth + 135;

        this.addChild(pile1);
        this.addChild(pile2);
        this.addChild(pileShadow);
    }
}

class Piles extends Container {
    private isPaused: boolean = true;
    private bird: Bird;
    private initPileNum: number;
    private currentPileIdx: number;

    constructor(bird: Bird) {
        super();
        emitter.on('isPausedChange', (status) => {
            this.isPaused = status;
        });
        this.bird = bird;
        this.initPileNum = 0;
        this.currentPileIdx = 0;
        this.init();

        this.onRender = () => {
            if (this.isPaused) {
                return;
            }
            this.position.x -= 4;
            const frontPile: Pile = this.getChildAt(0);
            const frontPileX = frontPile.getGlobalPosition().x;

            if (this.bird.position.y > frontPile.height - birdConfig.h / 2) {
                this.onLoss();
            }
            if (frontPileX <= 130 && frontPileX >= birdConfig.x - pileConfig.pileWidth) {
                if (
                    this.bird.position.y <= frontPile.yRange[0] + birdConfig.h / 2 ||
                    this.bird.position.y >= frontPile.yRange[1] - birdConfig.h / 2
                ) {
                    this.onLoss();
                }
                if (frontPileX === birdConfig.x - pileConfig.pileWidth) {
                    this.onPass();
                }
                frontPile.crossingBird = true;
            }

            // frontPile leave stage
            if (frontPileX < -pileConfig.pileWidth) {
                this.removeChildAt(0);
                this.addChild(new Pile(this.currentPileIdx));
                this.currentPileIdx += 1;
            }
        };
    }

    public init() {
        this.removeChildren();
        const voidWidth = window.innerWidth - birdConfig.w - birdConfig.x - pileConfig.pileGap;
        this.initPileNum = Math.ceil(voidWidth / (pileConfig.pileWidth + pileConfig.pileGap)) + 1;
        this.currentPileIdx = this.initPileNum + 1;
        for (let i = 0; i < this.initPileNum + 1; i++) {
            const p = new Pile(i);
            this.addChild(p);
        }

        this.position.x = 400;
    }
    public onLoss() {
        emitter.emit('isPausedChange', true);
        emitter.emit('onLoss', true);
    }
    public onPass() {
        scoreSingleton.count();
    }
}
export default Piles;
