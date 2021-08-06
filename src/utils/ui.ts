import * as PIXI from 'pixi.js'
import {drawRough, roughGenerator} from "./styles";
import {Round} from "./math";

/**
 * 给绘制对象添加可操作区域
 */
export function ActiveObject(object: PIXI.Container) {
    object.interactive = true;
    object.hitArea = new PIXI.Rectangle(0, 0, object.width, object.height);
    return object;
}

export interface PositionWindow {
    width: number;
    height: number;
}

export function SetPosition(obj: PIXI.Container, left: number, top: number, window: PositionWindow = {
    width: 1920,
    height: 1080
}) {
    const [x, y] = [left * window.width, top * window.height].map(i => Math.round(i));
    obj.position.x = x - Round(obj.width / 2);
    obj.position.y = y - Round(obj.height / 2);


    // 如果内容超出则恢复定位
    if (obj.position.x < 0) {
        obj.position.x = window.width * 0.05;
    }
    if (obj.position.y < 0) {
        obj.position.y = window.height * 0.05;
    }

    // 如果内容超出则恢复定位
    if (obj.position.x + obj.width > window.width) {
        obj.position.x = window.width - window.width * 0.05 - obj.width;
    }
    if (obj.position.y + obj.height > window.height) {
        obj.position.y = window.height - window.height * 0.05 - obj.height;
    }
    return obj;
}

export function CreateButton(text: string, width?: number, padding: number = 10) {
    const textObj = new PIXI.Text(text, {
        fontSize: 16,
        letterSpacing: 1,
        fontWeight: '300',
    });
    const textWidth = textObj.width;
    const textHeight = textObj.height;

    let borderWidth = Round(textWidth + padding * 2);
    const borderHeight = Round(textHeight + padding * 2);

    if (width && width < textWidth) {
        borderWidth = width;
    }

    let borderGraphics = (new PIXI.Graphics()).lineStyle(1, 0x000444, 1);
    borderGraphics = drawRough(borderGraphics, roughGenerator.rectangle(0, 0, borderWidth, borderHeight));

    textObj.position.x = Round((borderWidth - textWidth - 1) / 2);
    textObj.position.y = Round((borderHeight - textHeight - 1) / 2);

    borderGraphics.addChild(textObj);

    return borderGraphics;
}

export function AddClick(obj: PIXI.Container, clickFn: (event: PIXI.InteractionEvent) => void) {
    obj.interactive = true;
    obj.buttonMode = true;
    obj = ActiveObject(obj);

    const oldW = obj.width;
    const oldH = obj.height;
    const halfW = Round((oldW * 0.25 / 2));
    const halfH = Round((oldH * 0.25 / 2));

    function pressDown() {
        obj.scale.set(1.25, 1.25);
        obj.position.x -= halfW
        obj.position.y -= halfH
    }

    function pressUp() {
        obj.scale.set(1, 1);
        obj.position.x += halfW
        obj.position.y += halfH
    }

    obj.addListener('pointerdown', () => {
        pressDown()
    }).addListener('pointerup', e => {
        pressUp();
        clickFn(e);
    }).addListener('pointerupoutside', e => {
        pressUp();
        clickFn(e);
    }).addListener('pointerover', () => {
        pressDown()
    }).addListener('pointerout', () => {
        pressUp();
    });
    return obj;
}
