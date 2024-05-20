import { Container, Graphics, Text } from 'pixi.js';

export class CommonBoard extends Container {
    private text: Text;
    constructor({ label, width, height, padding }: { label: string; width: number; height: number; padding: number }) {
        super();

        this.text = new Text({
            text: label,
            style: {
                fontFamily: 'Shrikhand',
                fill: 0xffffff,
            },
        });

        this.text.x = padding;
        this.text.y = padding;

        const button = new Graphics();
        button.roundRect(0, 0, this.text.width + padding * 2, height, 15);
        button.fill(0x84d0ff);
        // this.text.onViewUpdate = () => {
        //     button.width = this.text.width + padding * 2;
        // };
        // text.width = width - padding * 2;
        // text.height = height - padding * 2;
        this.addChild(button);
        this.addChild(this.text);
    }
    public update({ label }: { label: string }) {
        console.log('on this update', label, this.text);
        this.text.text = label;
    }
}
