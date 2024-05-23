import { Container, Sprite, Texture } from 'pixi.js';
import { emitter } from '../store/emitter';
import { setMasterVolume } from '../utils/audio';

const volLsKey = 'piggyVolSet';
export class VolControl extends Container {
    private volButton: Sprite;
    private volStatus: boolean;
    constructor() {
        super();
        const volStatus: string | null = localStorage.getItem(volLsKey);
        if (volStatus === null) {
            this.volStatus = true;
            localStorage.setItem(volLsKey, this.volStatus ? '1' : '0');
            setMasterVolume(1);
        } else {
            this.volStatus = volStatus === '1';
            setMasterVolume(this.volStatus ? 1 : 0);
        }

        const volOff = Texture.from('volume_off');
        const volUp = Texture.from('volume_up');
        this.width = 60;
        this.height = 60;
        this.volButton = Sprite.from(this.volStatus ? volOff : volUp);
        this.volButton.width = 60;
        this.volButton.height = 60;
        this.volButton.x = 10;
        this.volButton.y = window.innerHeight - 60;
        this.volButton.eventMode = 'static';
        this.volButton.cursor = 'pointer';
        this.volButton.alpha = 0.8;
        this.volButton.onmouseenter = () => {
            this.volButton.y -= 5;
            this.volButton.alpha = 1;
        };

        this.volButton.onmouseleave = () => {
            this.volButton.y += 5;
            this.volButton.alpha = 0.8;
        };

        this.volButton.onclick = () => {
            if (this.volStatus) {
                setMasterVolume(0);
            } else {
                setMasterVolume(1);
            }

            this.volStatus = !this.volStatus;
            localStorage.setItem(volLsKey, this.volStatus ? '1' : '0');
            this.volButton.texture = this.volStatus ? volOff : volUp;
        };

        this.addChild(this.volButton);
        emitter.on('onResize', ({ height }) => {
            this.volButton.y = height - 60;
        });
    }
}
