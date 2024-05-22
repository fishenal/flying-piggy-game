import { FancyButton } from '@pixi/ui';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
const args = {
    color: '#fd6f90',

    hoverColor: '#FEC230',
    pressedColor: '0x84d0ff',
    disabledColor: '#6E6E6E',
    width: 200,
    height: 60,
    padding: 8,
    radius: 10,
    iconOffsetX: 0,
    iconOffsetY: -30,
    textOffsetX: 0,
    textOffsetY: 0,
    defaultTextScale: 0.99,
    defaultIconScale: 0.99,
    defaultOffsetY: 0,
    hoverOffsetY: -1,
    pressedOffsetY: 5,
    disabledOffsetY: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    animationDuration: 100,
    disabled: false,
    action: () => {
        console.log('on action');
    },
};
export class CommonButton extends Container {
    constructor({
        text,
        textColor = 0xc0dfff,
        icon,
        onPress,
    }: {
        text: string;
        textColor?: number;
        icon?: Sprite;
        onPress: () => void;
    }) {
        super();

        const {
            width,
            height,
            radius,
            color,
            hoverColor,
            pressedColor,
            disabledColor,
            disabled,
            padding,
            anchorX,
            anchorY,
            iconOffsetX,
            iconOffsetY,
            textOffsetX,
            textOffsetY,
            defaultTextScale,
            defaultIconScale,
            defaultOffsetY,
            hoverOffsetY,
            pressedOffsetY,
            disabledOffsetY,
            animationDuration,
        } = args;

        const button = new FancyButton({
            defaultView: new Graphics().roundRect(0, 0, width, height, radius).fill(color),
            hoverView: new Graphics().roundRect(0, 0, width, height, radius).fill(hoverColor),
            pressedView: new Graphics().roundRect(0, 0, width, height, radius).fill(pressedColor),
            disabledView: new Graphics().roundRect(0, 0, width, height, radius).fill(disabledColor),
            text: new Text({
                text,
                style: {
                    fill: textColor,
                    fontFamily: 'Shrikhand',
                    fontSize: 55,
                },
            }),
            padding,
            icon,
            offset: {
                default: { y: defaultOffsetY },
                hover: { y: hoverOffsetY },
                pressed: { y: pressedOffsetY },
                disabled: { y: disabledOffsetY },
            },
            textOffset: {
                x: textOffsetX,
                y: textOffsetY,
            },
            iconOffset: {
                x: iconOffsetX,
                y: iconOffsetY,
            },
            defaultTextScale,
            defaultIconScale,
            animations: {
                default: {
                    props: {
                        scale: { x: 1, y: 1 },
                        y: defaultOffsetY,
                    },
                    duration: animationDuration,
                },
                hover: {
                    props: {
                        scale: { x: 1.03, y: 1.03 },
                        y: hoverOffsetY,
                    },
                    duration: animationDuration,
                },
                pressed: {
                    props: {
                        scale: { x: 0.9, y: 0.9 },
                        y: pressedOffsetY,
                    },
                    duration: animationDuration,
                },
            },
        });

        if (disabled) {
            button.enabled = false;
        }

        button.anchor.set(anchorX, anchorY);
        button.onPress.connect(onPress);
        // button.onDown.connect(() => action('onDown'));
        // button.onUp.connect(() => action('onUp'));
        // button.onHover.connect(() => action('onHover'));
        // button.onOut.connect(() => action('onOut'));
        // button.onUpOut.connect(() => action('onUpOut'));
        // button.interactive = true;
        this.addChild(button);
    }
}
