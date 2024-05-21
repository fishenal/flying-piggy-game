import { Layout } from '@pixi/layout';
import { Container, Text } from 'pixi.js';

export class CommonBoard extends Container {
    private text: Text;
    private wrapper: Layout;
    constructor({ label }: { label: string; width?: number; height?: number; padding?: number }) {
        super();
        this.text = new Text({
            text: label,
        });
        this.wrapper = new Layout({
            content: this.text,
            styles: {
                background: 0x84d0ff,
                color: 0xffffff,
                borderRadius: 15,
                fontSize: 30,
                fontFamily: 'Shrikhand',
                // marginLeft: 150,
                width: 100,
                position: 'center',
                textAlign: 'center',
                height: 50,
                anchorY: 0,
            },
        });
        this.wrapper.resize(this.width, this.height);

        this.addChild(this.wrapper);
    }
    public update({ label }: { label: string }) {
        this.text.text = label;
    }
}
