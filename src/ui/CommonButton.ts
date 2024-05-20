import { Container, Graphics, Text } from 'pixi.js';

export class CommonButton extends Container {
    private dimension: { width: number; height: number; padding: number; fontSize: number };
    constructor({ label, size, color = 0xffffff }: { label: string; size: 'lg' | 'md' | 'sm'; color?: number }) {
        super();
        if (size === 'lg') {
            this.dimension = {
                width: 200,
                height: 60,
                padding: 12,
                fontSize: 24,
            };
        } else {
            this.dimension = {
                width: 200,
                height: 60,
                padding: 12,
                fontSize: 28,
            };
        }
        const { width, height, fontSize, padding } = this.dimension;
        this.eventMode = 'static';
        this.cursor = 'pointer';

        // button.pivot = { x: width / 2, y: height / 2 };
        const text = new Text({
            text: label,
            style: {
                fontSize,
                fontFamily: 'Shrikhand',
                fill: color,
            },
        });
        text.x = padding;
        text.y = padding;
        // button.width = text.width + padding * 2;
        const button = new Graphics();
        button.roundRect(0, 0, text.width + padding * 2, height, 15);
        button.fill(0x84d0ff);
        // text.pivot = { x: width / 2, y: height / 2 };
        // text.width = width - padding * 2;
        // text.height = height - padding * 2;
        this.addChild(button);
        this.addChild(text);
        // this.onPress.connect(this.handlePress);
    }
    // public handlePress() {
    //     console.log('button press');
    // }
}
