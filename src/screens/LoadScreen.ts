import { ProgressBar } from '@pixi/ui';
import { Container, Graphics } from 'pixi.js';
import { emitter } from '../store/emitter';
class LoadScreen extends Container {
    private progressBar: ProgressBar;
    constructor() {
        super();
        this.progressBar = new ProgressBar({
            bg: new Graphics().roundRect(0, 0, 300, 30).fill(0xfd6f90),
            fill: new Graphics().roundRect(0, 0, 300, 30).fill(0x84d0ff),
            progress: 50,
        });
        this.progressBar.x = window.innerWidth / 2 - 300 / 2;
        this.progressBar.y = window.innerHeight / 2 - 300 / 2;
        emitter.on('progressChange', (e) => {
            this.progressBar.progress = e * 100;
        });

        this.addChild(this.progressBar);
    }
}
export default LoadScreen;
