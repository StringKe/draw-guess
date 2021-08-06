import * as PIXI from 'pixi.js'
import {AddClick, CreateButton, SetPosition} from "./utils/ui";

export class Main {
    private app!: PIXI.Application;

    constructor(private container: HTMLElement) {
        PIXI.settings.RESOLUTION = Math.floor(window.devicePixelRatio);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.utils.skipHello();
    }

    init() {
        this.app = new PIXI.Application({
            width: 1280,
            height: 720,
            // backgroundColor: 0xffffff,
            backgroundColor: 0xfefae0,
            resizeTo: window,
            antialias: true,
        });
        this.container.appendChild(this.app.view);
        this.loadUis();
    }

    loadUis() {
        const startGameButton = AddClick(SetPosition(CreateButton("开始游戏"), 0.5, 0.5, this.app.screen), e => {
            console.log('click');
        });
        const gameLobby = AddClick(SetPosition(CreateButton("游戏大厅"), 0.5, 0.5, this.app.screen), e => {
            console.log('click');
        });
        const joinRoomButton = AddClick(SetPosition(CreateButton("加入房间"), 0.5, 0.5, this.app.screen), e => {
            console.log('click');
        });
        joinRoomButton.y += gameLobby.height + 10;
        startGameButton.y -= gameLobby.height + 10;

        this.app.stage.addChild(joinRoomButton);
        this.app.stage.addChild(startGameButton);
        this.app.stage.addChild(gameLobby);
    }
}


