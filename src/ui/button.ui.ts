import {BasicUi} from "./basic.ui";
import * as PIXI from 'pixi.js'
import {drawRough, roughGenerator} from "../utils/styles";

export class ButtonUi extends BasicUi {
    constructor(app: PIXI.Application) {
        super(app);
    }

    render() {
        this.renderRectangle();
        // this.renderEllipse();
        // this.renderLine();
        // this.renderCircle();
        // this.renderArc();
    }

    private renderRectangle() {
        const objectRender = drawRough((new PIXI.Graphics()).lineStyle(2, 0x000444, 1), roughGenerator.rectangle(0, 0, 100, 40));
        objectRender.position.x = 10;
        objectRender.position.y = 10;

        this.app.stage.addChild(objectRender)
    }

    //
    // private renderArc() {
    //     const objectRender = drawRough((new PIXI.Graphics()).lineStyle(2, 0x000111, 1), roughGenerator.arc(0, 0, 100, 100, 10, 50));
    //     objectRender.position.x = 100;
    //     objectRender.position.y = 100;
    //     this.app.stage.addChild(objectRender)
    // }
    //
    //
    // private renderCircle() {
    //     const objectRender = drawRough((new PIXI.Graphics()).lineStyle(2, 0x000222, 1), roughGenerator.circle(0, 0, 100));
    //     objectRender.position.x = 230;
    //     objectRender.position.y = 230;
    //
    //     this.app.stage.addChild(objectRender)
    // }
    //
    // private renderLine() {
    //     const objectRender = drawRough((new PIXI.Graphics()).lineStyle(2, 0x000333, 1), roughGenerator.line(300, 300, 400, 400));
    //     objectRender.position.x = 10;
    //     objectRender.position.y = 10;
    //
    //     this.app.stage.addChild(objectRender)
    // }
    //
    //
    // private renderEllipse() {
    //     const objectRender = drawRough((new PIXI.Graphics()).lineStyle(2, 0x000555, 1), roughGenerator.ellipse(0, 0, 100, 100));
    //     objectRender.position.x = 200;
    //     objectRender.position.y = 60;
    //
    //     this.app.stage.addChild(objectRender)
    // }
}