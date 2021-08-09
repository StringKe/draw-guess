import moment from 'moment';

import * as PIXI from 'pixi.js';

import Scene from '../scene';
import { SettingIcon } from '../utils/icons';
import { AddClick, CreateTextBox, SetPosition } from '../utils/ui';
import { BasicGameScene } from './game/basic.game.scene';

/**
 * 欢迎场景
 */
export class StartScene extends Scene {
    name = 'start';

    startMathGame(): void {
        this.game.backend.getRoom().then((info) => {
            let infoTitle: PIXI.Container;
            const showInfos = (info: MGOBE.types.RoomInfo): void => {
                if (infoTitle) {
                    this.container.removeChild(infoTitle);
                }
                infoTitle = SetPosition(
                    CreateTextBox(
                        `匹配到房间 ${info.name} 当前存在玩家 ${info.playerList.length}`,
                    ),
                    0.5,
                    0.1,
                    this.game.screen,
                );
                this.container.addChild(infoTitle);

                const play = (): void => {
                    window.clearInterval(loopInfo);
                    console.log('可以开始游戏了');
                    this.game.sceneManager.active('basic.game');
                    const game =
                        this.game.sceneManager.get<BasicGameScene>(
                            'basic.game',
                        );
                    if (game) {
                        game.start();
                    }
                };

                if (info.playerList.length === info.maxPlayers) {
                    console.log(
                        info.startGameTime,
                        info.createTime,
                        moment(info.startGameTime).diff(moment()),
                    );
                    play();
                    // this.game.backend.room.dismissRoom({},)
                }
            };
            showInfos(info);
            const loopInfo = setInterval(() => {
                this.game.backend.room.getRoomDetail((event) => {
                    if (event.code === 0 && event.data) {
                        showInfos(event.data.roomInfo);
                    }
                });
            }, 1000);

            this.game.backend.room.onJoinRoom = (event) => {
                const info = event.data.roomInfo;
                showInfos(info);
            };
        });
    }

    load(): void {
        const startGameButton = SetPosition(
            CreateTextBox('开始游戏'),
            0.5,
            0.5,
            this.game.screen,
        );
        AddClick(startGameButton, (e) => {
            console.log('点击开始游戏');
            this.startMathGame();
        });
        const gameLobby = AddClick(
            SetPosition(CreateTextBox('游戏大厅'), 0.5, 0.5, this.game.screen),
            (e) => {
                console.log('click');
            },
        );
        const joinRoomButton = AddClick(
            SetPosition(CreateTextBox('加入房间'), 0.5, 0.5, this.game.screen),
            (e) => {
                console.log('click');
            },
        );
        joinRoomButton.y += gameLobby.height + 10;
        startGameButton.y -= gameLobby.height + 10;

        const playerInfo = AddClick(
            SetPosition(
                CreateTextBox(this.game.backend.playerInfo.name),
                0.98,
                0.03,
                this.game.screen,
            ),
            (e) => {
                console.log('click');
            },
        );

        const setting = AddClick(
            SetPosition(SettingIcon(), 0.02, 0.03, this.game.screen),
            (e) => {
                console.log('click setting');
                this.game.sceneManager.active('setting');
            },
        );
        this.container.addChild(setting);

        this.container.addChild(startGameButton);
        this.container.addChild(joinRoomButton);
        this.container.addChild(gameLobby);
        this.container.addChild(playerInfo);
    }
}
