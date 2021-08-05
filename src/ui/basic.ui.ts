import * as PIXI from 'pixi.js'

export class BasicUi {
    app: PIXI.Application;

    protected constructor(app: PIXI.Application) {
        this.app = app;
    }

}