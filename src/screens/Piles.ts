import { Container, Graphics, Pool, Sprite } from 'pixi.js';
import { birdConfig, globalConfig, pileConfig } from '../utils/config';
import { emitter } from '../store/emitter';
import { randomRange } from '../utils/random';
import Bird from './Bird';
import { scoreSingleton } from '../store/score';

class Pile extends Container {
    private randomPassPoint: number = 0;
    private graphics: Graphics;
    public crossingBird: boolean;
    public yRange: number[];

    constructor() {
        super();
        this.crossingBird = false;
        this.yRange = [0, 0];
        this.graphics = new Graphics();
        const pile = Sprite.from('pile');
        this.width = pile.width = pileConfig.pileWidth;
        this.height = pile.height = window.innerHeight - globalConfig.groundHeight;
        this.position.y = 0;
        this.addChild(pile);
    }
    init({ num }: { num: number }) {
        this.height = window.innerHeight - globalConfig.groundHeight;

        this.randomPassPoint = randomRange(0, this.height - pileConfig.gapHeight + 1);
        this.yRange = [this.randomPassPoint, this.randomPassPoint + pileConfig.gapHeight];
        this.graphics = new Graphics();
        this.graphics.rect(0, 0, pileConfig.pileWidth, this.randomPassPoint);
        this.graphics.rect(
            0,
            this.randomPassPoint + pileConfig.gapHeight,
            pileConfig.pileWidth,
            this.height - this.randomPassPoint - pileConfig.gapHeight,
        );
        this.graphics.fill(0x000000);

        this.addChild(this.graphics);
        this.mask = this.graphics;
        this.position.x = num * pileConfig.pileGap;
    }
    reset() {
        this.mask = null;
        this.graphics.destroy();
        this.crossingBird = false;
        this.yRange = [0, 0];
    }
}

class Piles extends Container {
    private pilePool: Pool<Pile>;
    private isPaused: boolean = true;
    private bird: Bird;
    constructor(bird: Bird) {
        super();
        emitter.on('isPausedChange', (status) => {
            this.isPaused = status;
        });
        this.bird = bird;
        const voidWidth = window.innerWidth - birdConfig.w - birdConfig.x - pileConfig.pileGap;
        const initPileNum = Math.ceil(voidWidth / (pileConfig.pileWidth + pileConfig.pileGap)) + 1;
        this.pilePool = new Pool(Pile, initPileNum);
        const piles: Pile[] = [];
        let currentPileIdx = initPileNum + 1;
        for (let i = 0; i < initPileNum + 1; i++) {
            const p = this.pilePool.get({ num: i });
            piles.push(p);
            this.addChild(p);
        }
        this.position.x = 400;
        this.onRender = () => {
            if (this.isPaused) {
                return;
            }
            this.position.x -= 4;
            const frontPileX = piles[0].getGlobalPosition().x;
            if (this.bird.position.y > piles[0].height - birdConfig.h / 2) {
                this.onLoss();
            }
            if (frontPileX <= 130 && frontPileX >= birdConfig.x - pileConfig.pileWidth) {
                if (
                    this.bird.position.y <= piles[0].yRange[0] + birdConfig.h / 2 ||
                    this.bird.position.y >= piles[0].yRange[1] - birdConfig.h / 2
                ) {
                    this.onLoss();
                }
                if (frontPileX === birdConfig.x - pileConfig.pileWidth) {
                    this.onPass();
                }
                piles[0].crossingBird = true;
            }

            if (frontPileX < -pileConfig.pileWidth) {
                const p = piles.shift();
                console.log('on return', this.pilePool.totalSize, this.pilePool.totalUsed);
                if (p) {
                    this.pilePool.return(p);
                    const newPile = this.pilePool.get({ num: currentPileIdx });
                    piles.push(newPile);
                    this.addChild(newPile);
                    currentPileIdx += 1;
                }
            }
        };
    }
    public onLoss() {
        emitter.emit('isPausedChange', true);
    }
    public onPass() {
        scoreSingleton.count();
    }
}
export default Piles;
