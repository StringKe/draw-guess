import FingerprintJS from '@fingerprintjs/fingerprintjs';

import '../sdk/MGOBE/MGOBE';
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

    get gameInfo(): MGOBE.types.GameInfoPara {
        return Object.assign(gameInfo, { openId: this.gameId });
    }

    get playerInfo(): MGOBE.types.PlayerInfoPara {
        const userInfo = {
            name: localStorage.getItem('user_name'),
            customPlayerStatus: 1,
            customProfile: '123',
        };
        if (!userInfo.name) {
            userInfo.name = '游客' + makeUserName();
            localStorage.setItem('user_name', userInfo.name);
        }
        return userInfo as MGOBE.types.PlayerInfoPara;
    }

    static async getUser(): Promise<string> {
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

        return await new Promise<string>((resolve, reject) => {
            getUserId.then((gameId) => {
                console.log('GameUserId', gameId);
                localStorage.setItem('game_id', gameId);
                resolve(gameId);
            });
        });
    }

    async getRoom(): Promise<MGOBE.types.RoomInfo> {
        return await new Promise<MGOBE.types.RoomInfo>((resolve) => {
            const matchRoomPara = {
                playerInfo: this.playerInfo,
                maxPlayers: 4,
                roomType: '1',
            };
            this.room.matchRoom(matchRoomPara, (matchRoomEvent) => {
                if (matchRoomEvent.code === 0 && matchRoomEvent.data) {
                    resolve(matchRoomEvent.data.roomInfo);
                } else if (matchRoomEvent.code === 20010) {
                    this.room.getRoomDetail((detailEvent) => {
                        if (detailEvent.code === 0 && detailEvent.data) {
                            resolve(detailEvent.data.roomInfo);
                        } else {
                            console.log('匹配失败', detailEvent.code);
                        }
                    });
                } else {
                    if (matchRoomEvent.code !== 0) {
                        console.log('匹配失败', matchRoomEvent.code);
                    }
                }
            });
        });
    }

    async init(): Promise<boolean> {
        return await new Promise<boolean>((resolve) => {
            MGOBE.Listener.init(this.gameInfo, config, (event) => {
                if (event.code === 0) {
                    resolve(true);
                    MGOBE.Listener.add(this.room);
                } else {
                    resolve(false);
                }
            });
        });
    }
}
