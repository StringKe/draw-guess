import '../sdk/MGOBE/MGOBE';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { makeUserName } from '../utils/math';

const gameInfo = {
  openId: '',
  gameId: 'obg-5i81ybwz', // 替换为控制台上的“游戏ID”
  secretKey: 'f81b70e0f72fa9971914eccb4fbf659213421527', // 替换为控制台上的“游戏Key”
};
const config = {
  url: '5i81ybwz.wxlagame.com', // 替换为控制台上的“域名”
  reconnectMaxTimes: 5,
  reconnectInterval: 1000,
  resendInterval: 1000,
  resendTimeout: 10000,
};

const fpPromise = FingerprintJS.load();

export class Backend {
  gameId: string;
  room: MGOBE.Room = new MGOBE.Room();

  constructor(gameUser: string) {
    this.gameId = gameUser;
  }

  get gameInfo() {
    return Object.assign(gameInfo, { openId: this.gameId });
  }

  get playerInfo() {
    const userInfo = {
      name: localStorage.getItem('user_name'),
      customPlayerStatus: 1,
      customProfile: '123',
    };
    if (!userInfo.name) {
      userInfo.name = '游客' + makeUserName();
      localStorage.setItem('user_name', userInfo.name);
    }
    // if (!userInfo.customProfile.createTime) {
    //   userInfo.customProfile.createTime = new Date().getTime().toString();
    // }
    // @ts-ignore
    // userInfo.customProfile = JSON.stringify(userInfo.customProfile);
    return userInfo;
  }

  static getUser() {
    const getUserId = new Promise<string>((resolve, reject) => {
      const gameId = localStorage.getItem('game_id');

      if (gameId) {
        resolve(gameId);
      } else {
        fpPromise.then((fp) => {
          fp.get().then((id) => {
            resolve(id.visitorId);
          });
        });
      }
    });

    return new Promise<string>((resolve, reject) => {
      getUserId.then((gameId) => {
        console.log('GameUserId', gameId);
        localStorage.setItem('game_id', gameId);
        resolve(gameId);
      });
    });
  }

  createRoom() {
    const matchRoomPara = {
      playerInfo: this.playerInfo,
      maxPlayers: 8,
      roomType: '1',
    };
    this.room.matchRoom(matchRoomPara, (event) => {
      console.log(event);
      if (event.code !== 0) {
        console.log('匹配失败', event.code);
      }
    });
    console.log(this.room);
  }

  init() {
    return new Promise<boolean>((resolve) => {
      MGOBE.Listener.init(
        Object.assign(gameInfo, { openId: this.gameId }),
        config,
        (event) => {
          if (event.code === 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }
}
