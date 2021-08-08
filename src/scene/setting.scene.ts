import Scene from '../scene';
import { CloseIcon } from '../utils/icons';
import { AddClick, SetPosition } from '../utils/ui';

/**
 * 功能设置场景
 */
export class SettingScene extends Scene {
    name = 'setting';

    load(): void {
        const close = AddClick(
            SetPosition(CloseIcon(), 0.98, 0.03, this.game.screen),
            (e) => {
                console.log('click close');
                this.game.sceneManager.active('start');
            },
        );
        this.container.addChild(close);
    }
}
