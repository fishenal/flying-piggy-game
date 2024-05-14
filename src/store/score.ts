import { emitter } from './emitter';

class Score {
    private score: number;
    constructor() {
        this.score = 0;
    }
    public count() {
        this.score += 1;
        emitter.emit('scoreChange', this.score);
    }
}
export const scoreSingleton = new Score();
