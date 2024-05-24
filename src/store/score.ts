import { emitter } from './emitter';

export const hiScoreLsKey = 'piggyHiScore';
class Score {
    public score: number;
    public hiScore: string;
    constructor() {
        this.score = 0;
        this.hiScore = '0';
    }
    public init() {
        try {
            const hiScore = window.CrazyGames.SDK.data.getItem(hiScoreLsKey);
            this.hiScore = hiScore || '0';
        } catch (error) {
            console.log('get hiscore from crazy error', error);
        }
    }
    public reset() {
        this.score = 0;
        this.init();
        emitter.emit('scoreChange', this.score);
    }
    public count() {
        this.score += 1;
        emitter.emit('scoreChange', this.score);
    }
    public updateHiScore(newScore: number) {
        this.hiScore = String(newScore);
        // localStorage.setItem(hiScoreLsKey, String(newScore));
        window.CrazyGames.SDK.data.setItem(hiScoreLsKey, String(newScore));
    }
}
export const scoreSingleton = new Score();
