import * as PIXI from 'pixi.js';
import { makeId } from './utils/math';
import { Game } from './game';

/**
 * 场景基类，所有场景均需继承此类实现load方法
 */
export default abstract class Scene {
  abstract name: string;
  public isLoading: boolean;
  public id: string;
  private root: PIXI.Container;

  constructor(public game: Game, id?: string) {
    this.id = id ? id : makeId();
    this.root = new PIXI.Container();
  }

  get container() {
    return this.root;
  }

  abstract load();

  destroy() {
    this.root.children.map((child) => {
      this.root.removeChild(child);
    });
  }
}
