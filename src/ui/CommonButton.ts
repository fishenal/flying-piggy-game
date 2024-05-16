import { FancyButton } from '@pixi/ui';

export class CommonButton extends FancyButton {
    constructor(label: string) {
        super({
            defaultView: 'button-large',
            hoverView: 'button-large-hover',
            pressedView: 'button-large-press',
            text: label,
            animations: {
                hover: {
                    props: {
                        scale: {
                            x: 1.1,
                            y: 1.1,
                        },
                    },
                    duration: 100,
                },
                pressed: {
                    props: {
                        scale: {
                            x: 0.9,
                            y: 0.9,
                        },
                    },
                    duration: 100,
                },
            },
        });
        this.width = 100;
        this.height = 80;
        // this.onPress.connect(this.handlePress);
    }
    // public handlePress() {
    //     console.log('button press');
    // }
}
