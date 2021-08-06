import * as PIXI from "pixi.js";
import {Game} from "./game";
import SceneManager from "./scene.manager";
import {StartScene} from "./scene/start.scene";

/**
 * 主入口
 */
export default class Main {
    private game!: Game;
    private sceneManager: SceneManager;

    constructor(private container: HTMLElement) {
        PIXI.settings.RESOLUTION = Math.floor(window.devicePixelRatio);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.utils.skipHello();
    }

    /**
     * 初始化游戏
     */
    init() {
        this.game = new Game(this.container, {
            width: 1920,
            height: 1080,
            backgroundColor: 0xfefae0,
            antialias: true,
            resizeTo: window,
        });
        this.container.appendChild(this.game.view);
        this.game.onResize();
        this.sceneManager = new SceneManager(this.game);
        this.loadScenes();
    }

    loadScenes() {
        this.sceneManager.add(new StartScene(this.game, 'start'));
        this.sceneManager.active('start')
    }
}
