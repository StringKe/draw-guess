import * as PIXI from 'pixi.js';

import { Backend } from './backend';
import { Game } from './game';
import { SettingScene } from './scene/setting.scene';
import { StartScene } from './scene/start.scene';

/**
 * 主入口
 */
export default class Main {
    private game!: Game;

    constructor(
        private readonly container: HTMLElement,
        public backend: Backend,
    ) {
        PIXI.settings.RESOLUTION = Math.floor(window.devicePixelRatio);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.utils.skipHello();
    }

    /**
     * 初始化游戏
     */
    init(): void {
        this.game = new Game(this.container, this.backend, {
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

    loadScenes(): void {
        this.game.sceneManager.add(new StartScene(this.game, 'start'));
        this.game.sceneManager.add(new SettingScene(this.game, 'setting'));
        this.game.sceneManager.active('start');
    }
}
