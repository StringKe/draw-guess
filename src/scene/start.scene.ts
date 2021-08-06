import Scene from '../scene';
import { AddClick, CreateButton, SetPosition } from '../utils/ui';
import { SettingIcon } from '../utils/icons';

/**
 * 欢迎场景
 */
export class StartScene extends Scene {
  name = 'start';

  load() {
    const startGameButton = SetPosition(
      CreateButton('开始游戏'),
      0.5,
      0.5,
      this.game.screen
    );
    AddClick(startGameButton, (e) => {
      console.log('点击开始游戏');
      this.game.backend.getRoom().then((info) => {
        let infoTitle;
        const showInfos = (info: MGOBE.types.RoomInfo) => {
          if (infoTitle) {
            this.container.removeChild(infoTitle);
          }
          infoTitle = SetPosition(
            CreateButton(
              `匹配到房间 ${info.name} 当前存在玩家 ${info.playerList.length}`
            ),
            0.5,
            0.1,
            this.game.screen
          );
          this.container.addChild(infoTitle);
        };
        showInfos(info);
        const loopInfo = setInterval(() => {
          this.game.backend.room.getRoomDetail((event) => {
            if (event.code === 0) {
              showInfos(event.data.roomInfo);
            }
          });
        }, 1000);

        this.game.backend.room.onJoinRoom = (event) => {
          const info = event.data.roomInfo;
          if (info.playerList.length === info.maxPlayers) {
            window.clearInterval(loopInfo);
            alert('可以开始游戏了');
          }
          showInfos(event.data.roomInfo);
        };
      });
    });
    const gameLobby = AddClick(
      SetPosition(CreateButton('游戏大厅'), 0.5, 0.5, this.game.screen),
      (e) => {
        console.log('click');
      }
    );
    const joinRoomButton = AddClick(
      SetPosition(CreateButton('加入房间'), 0.5, 0.5, this.game.screen),
      (e) => {
        console.log('click');
      }
    );
    joinRoomButton.y += gameLobby.height + 10;
    startGameButton.y -= gameLobby.height + 10;

    const playerInfo = AddClick(
      SetPosition(
        CreateButton(this.game.backend.playerInfo.name),
        0.98,
        0.03,
        this.game.screen
      ),
      (e) => {
        console.log('click');
      }
    );

    const setting = AddClick(
      SetPosition(SettingIcon(), 0.02, 0.03, this.game.screen),
      (e) => {
        console.log('click setting');
        this.game.sceneManager.active('setting');
      }
    );
    this.container.addChild(setting);

    this.container.addChild(startGameButton);
    this.container.addChild(joinRoomButton);
    this.container.addChild(gameLobby);
    this.container.addChild(playerInfo);
  }
}
