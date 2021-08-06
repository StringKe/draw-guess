import Scene from "../scene";
import {AddClick, CreateButton, SetPosition} from "../utils/ui";
import {SettingIcon} from "../utils/icons";

/**
 * 欢迎场景
 */
export class StartScene extends Scene {
    name = 'start';

    load() {
        const startGameButton = AddClick(SetPosition(CreateButton("开始游戏"), 0.5, 0.5, this.game.screen), e => {
            console.log('click');
        });
        const gameLobby = AddClick(SetPosition(CreateButton("游戏大厅"), 0.5, 0.5, this.game.screen), e => {
            console.log('click');
        });
        const joinRoomButton = AddClick(SetPosition(CreateButton("加入房间"), 0.5, 0.5, this.game.screen), e => {
            console.log('click');
        });
        joinRoomButton.y += gameLobby.height + 10;
        startGameButton.y -= gameLobby.height + 10;

        const setting = AddClick(SetPosition(SettingIcon(), 0.02, 0.03, this.game.screen), e => {
            console.log('click setting');
            this.game.sceneManager.active('setting');
        });
        this.container.addChild(setting);

        this.container.addChild(startGameButton);
        this.container.addChild(joinRoomButton);
        this.container.addChild(gameLobby);
    }
}
