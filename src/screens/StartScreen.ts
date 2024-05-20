import { Container, Text } from 'pixi.js';
class StartScreen extends Container {
    constructor() {
        super();
        const loadingText = new Text({ text: 'Start' });
        this.addChild(loadingText);
    }
}
export default StartScreen;
