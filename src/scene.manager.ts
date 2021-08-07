import { Game } from './game';
import Scene from './scene';

/**
 * 场景管理
 */
export default class SceneManager {
    private readonly scenes: Map<string, Scene> = new Map<string, Scene>();

    constructor(private readonly game: Game) {}

    /**
     * 激活一个场景
     * 此场景会将当前以及显示的所有场景进行注销
     * @param find
     */
    active(find: string | Scene): boolean {
        let id = find as string;
        if (typeof find !== 'string') {
            id = find.id;
        }
        const instance = this.scenes.get(id);
        if (instance) {
            if (!instance.isLoading) {
                instance.load();
                instance.isLoading = true;
            }
            this.game.root.children.forEach((scene) => {
                this.game.root.removeChild(scene);
            });
            this.game.root.addChild(instance.container);
            return true;
        }
        return false;
    }

    /**
     * 添加一个场景
     * @param scene
     */
    add(scene: Scene): void {
        if (!scene.isLoading) {
            scene.load();
            scene.isLoading = true;
        }
        this.scenes.set(scene.id, scene);
    }

    /**
     * 删除一个场景
     * @param find
     */
    remove(find: string | Scene): boolean {
        let id = find as string;
        if (typeof find !== 'string') {
            id = find.id;
        }
        const instance = this.scenes.get(id);
        if (instance) {
            this.game.root.removeChild(instance.container);
            instance.destroy();
            this.scenes.delete(id);
            return true;
        }
        return false;
    }
}
