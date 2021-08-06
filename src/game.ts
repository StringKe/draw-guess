import * as PIXI from 'pixi.js'
import SceneManager from "./scene.manager";

/**
 * 游戏管理对象
 */
export class Game extends PIXI.Application {
    root: PIXI.Container;
    designWidth: number = 1920;
    designHeight: number = 1080;

    private container: HTMLElement;
    private options: PIXI.IApplicationOptions;
    sceneManager: SceneManager;

    constructor(element: HTMLElement, options?: PIXI.IApplicationOptions) {
        super(options);

        PIXI.settings.RESOLUTION = Math.floor(window.devicePixelRatio);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.utils.skipHello();

        this.options = options;
        this.container = element;
        this.container.appendChild(this.view);
        this.root = new PIXI.Container();
        this.stage.addChild(this.root);
        this.sceneManager = new SceneManager(this);
    }

    onResize = () => {

    };

}



