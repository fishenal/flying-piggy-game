import { emitter } from './emitter';

export const hiScoreLsKey = 'piggyHiScore';
class Score {
    public score: number;
    public hiScore: string;
    constructor() {
        this.score = 0;
        const lsHiScore = localStorage.getItem(hiScoreLsKey);
        this.hiScore = lsHiScore || '0';
    }
    public reset() {
        this.score = 0;
        const lsHiScore = localStorage.getItem(hiScoreLsKey);
        this.hiScore = lsHiScore || '0';
        emitter.emit('scoreChange', this.score);
    }
    public count() {
        this.score += 1;
        emitter.emit('scoreChange', this.score);
    }
    public updateHiScore(newScore: number) {
        this.hiScore = String(newScore);
        localStorage.setItem(hiScoreLsKey, String(newScore));
    }
}
export const scoreSingleton = new Score();
