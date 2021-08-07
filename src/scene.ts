import * as PIXI from 'pixi.js';

import { Game } from './game';
import { makeId } from './utils/math';

/**
 * 场景基类，所有场景均需继承此类实现load方法
 */
export default abstract class Scene {
    abstract name: string;
    public isLoading: boolean = false;
    public id: string;
    private readonly root: PIXI.Container;

    constructor(public game: Game, id?: string) {
        this.id = id ?? makeId();
        this.root = new PIXI.Container();
    }

    get container(): PIXI.Container {
        return this.root;
    }

    abstract load(): void;

    destroy(): void {
        this.root.children.forEach((child) => {
            this.root.removeChild(child);
        });
    }
}
