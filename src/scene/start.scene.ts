import Scene from "../scene";
import {AddClick, CreateButton, SetPosition} from "../utils/ui";

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

        this.container.addChild(startGameButton);
        this.container.addChild(joinRoomButton);
        this.container.addChild(gameLobby);
    }
}
