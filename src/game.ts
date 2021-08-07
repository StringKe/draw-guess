import * as PIXI from 'pixi.js';

import { Backend } from './backend';
import SceneManager from './scene.manager';

/**
 * 游戏管理对象
 */
export class Game extends PIXI.Application {
    backend: Backend;
    root: PIXI.Container;
    designWidth: number = 1920;
    designHeight: number = 1080;
    sceneManager: SceneManager;
    private readonly container: HTMLElement;
    private readonly options: PIXI.IApplicationOptions;

    constructor(
        element: HTMLElement,
        backend: Backend,
        options?: PIXI.IApplicationOptions,
    ) {
        super(options);

        PIXI.settings.RESOLUTION = Math.floor(window.devicePixelRatio);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.utils.skipHello();

        this.backend = backend;
        this.options = options;
        this.container = element;
        this.container.appendChild(this.view);
        this.root = new PIXI.Container();
        this.stage.addChild(this.root);
        this.sceneManager = new SceneManager(this);
    }

    onResize: () => void = () => {};
}
