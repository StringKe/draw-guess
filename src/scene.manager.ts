import {Game} from "./game";
import Scene from "./scene";

export default class SceneManager {
    private scenes: Map<string, Scene> = new Map<string, Scene>();

    constructor(private game: Game) {
    }

    active(find: string | Scene) {
        let id = find as string;
        if (typeof find !== 'string') {
            id = find.id;
        }
        const instance = this.scenes.get(id);
        instance.load();
        this.game.root.children.map((scene) => {
            this.game.root.removeChild(scene);
        });
        this.game.root.addChild(instance.container);
    }

    add(scene: Scene) {
        this.scenes.set(scene.id, scene);
    }

    remove(find: string | Scene) {
        let id = find as string;
        if (typeof find !== 'string') {
            id = find.id;
        }
        const instance = this.scenes.get(id);
        this.game.root.removeChild(instance.container);
        instance.destroy();
        this.scenes.delete(id);
    }
}
