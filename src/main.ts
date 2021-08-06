import * as PIXI from "pixi.js";
import {Game} from "./game";
import {StartScene} from "./scene/start.scene";
import {SettingScene} from "./scene/setting.scene";

/**
 * 主入口
 */
export default class Main {
    private game!: Game;

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
        this.loadScenes();
    }

    loadScenes() {
        this.game.sceneManager.add(new StartScene(this.game, 'start'));
        this.game.sceneManager.add(new SettingScene(this.game, 'setting'));
        this.game.sceneManager.active('start')
    }
}
