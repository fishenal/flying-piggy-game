import { Container, Text } from 'pixi.js';
class LoadScreen extends Container {
    constructor() {
        super();
        const loadingText = new Text({ text: 'Loading' });
        this.addChild(loadingText);
    }
}
export default LoadScreen;
