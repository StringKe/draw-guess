import { Game } from './game';
import Scene from './scene';

/**
 * 场景管理
 */
export default class SceneManager {
  private scenes: Map<string, Scene> = new Map<string, Scene>();

  constructor(private game: Game) {}

  /**
   * 激活一个场景
   * 此场景会将当前以及显示的所有场景进行注销
   * @param find
   */
  active(find: string | Scene) {
    let id = find as string;
    if (typeof find !== 'string') {
      id = find.id;
    }
    const instance = this.scenes.get(id);
    if (!instance.isLoading) {
      instance.load();
      instance.isLoading = true;
    }
    this.game.root.children.map((scene) => {
      console.log(scene);
      this.game.root.removeChild(scene);
    });
    this.game.root.addChild(instance.container);
  }

  /**
   * 添加一个场景
   * @param scene
   */
  add(scene: Scene) {
    this.scenes.set(scene.id, scene);
  }

  /**
   * 删除一个场景
   * @param find
   */
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
