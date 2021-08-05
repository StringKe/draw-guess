import * as PIXI from 'pixi.js'
import {ButtonUi} from "./ui/button.ui";

export class Main {
    private app!: PIXI.Application;

    constructor(private container: HTMLElement) {
        PIXI.settings.RESOLUTION = Math.floor(window.devicePixelRatio);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.utils.skipHello();
    }

    init() {
        this.app = new PIXI.Application({
            width: 1920,
            height: 1080,
            // backgroundColor: 0xffffff,
            backgroundColor: 0xfefae0,
            resizeTo: window,
            antialias: true,
        });
        this.container.appendChild(this.app.view);
        this.loadUis();
    }

    loadUis() {
        const button = new ButtonUi(this.app);
        button.render()
    }
}


