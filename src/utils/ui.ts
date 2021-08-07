import * as PIXI from 'pixi.js';

import { Round } from './math';
import { drawRough, roughGenerator } from './styles';

/**
 * 给绘制对象添加可操作区域
 */
export function ActiveObject(object: PIXI.Container): PIXI.Container {
    object.interactive = true;
    object.hitArea = new PIXI.Rectangle(0, 0, object.width, object.height);
    return object;
}

/**
 * 绘制最大区域定义
 */
export interface PositionWindow {
    width: number;
    height: number;
}

/**
 * 按照百分百设置对象的位置
 *
 * 基于对象中心点，而不是对象的左上角
 *
 * @param obj
 * @param left x轴百分比
 * @param top x轴百分比
 * @param window 最大区域设置
 * @constructor
 */
export function SetPosition(
    obj: PIXI.Container,
    left: number,
    top: number,
    window: PositionWindow = {
        width: 1920,
        height: 1080,
    },
): PIXI.Container {
    const [x, y] = [left * window.width, top * window.height].map((i) =>
        Round(i),
    );

    obj.position.x = x + Round(obj.width / 2);
    obj.position.y = y + Round(obj.height / 2);

    const padding = 40;
    const minX = padding;
    const minY = padding;
    const maxW = window.width - padding * 2;
    const maxH = window.height - padding * 2;

    const boxX = obj.position.x;
    const boxY = obj.position.y;
    const boxW = obj.width;
    const boxH = obj.height;
    const boxR = boxX + boxW;
    const boxB = boxY + boxH;

    // 如果内容超出则恢复定位
    if (obj.position.x < minX) {
        obj.position.x = minX;
    }
    if (obj.position.y < minY) {
        obj.position.y = minY;
    }

    // 如果内容超出则恢复定位
    if (boxR > maxW) {
        obj.position.x = maxW - boxW;
    }
    if (boxB > maxH) {
        obj.position.y = maxH - boxH;
    }

    return obj;
}

/**
 * 创建一个按钮，默认缩放效果为放大
 * @param text
 * @param width
 * @param padding
 * @constructor
 */
export function CreateButton(
    text: string,
    width?: number,
    padding: number = 10,
): PIXI.Graphics {
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

    let borderGraphics = new PIXI.Graphics().lineStyle(1, 0x000000, 1);
    borderGraphics = drawRough(
        borderGraphics,
        roughGenerator.rectangle(0, 0, borderWidth, borderHeight),
    );

    textObj.position.x = Round((borderWidth - textWidth - 1) / 2);
    textObj.position.y = Round((borderHeight - textHeight - 1) / 2);

    borderGraphics.addChild(textObj);

    return borderGraphics;
}

/**
 * 添加点击事件
 *
 * @param obj
 * @param clickFn
 * @constructor
 */
export function AddClick(
    obj: PIXI.Container,
    clickFn: (event: PIXI.InteractionEvent) => void,
): PIXI.Container {
    obj.interactive = true;
    obj.buttonMode = true;
    obj = ActiveObject(obj);

    const oldW = obj.width;
    const oldH = obj.height;
    const halfW = Round((oldW * 0.25) / 2);
    const halfH = Round((oldH * 0.25) / 2);

    let isPressDown = false;

    function pressDown(): void {
        if (!isPressDown) {
            obj.scale.set(1.25, 1.25);
            obj.position.x -= halfW;
            obj.position.y -= halfH;
            isPressDown = true;
        }
    }

    function pressUp(): void {
        if (isPressDown) {
            obj.scale.set(1, 1);
            obj.position.x += halfW;
            obj.position.y += halfH;
            isPressDown = false;
        }
    }

    obj.addListener('pointerdown', () => {
        pressDown();
    })
        .addListener('pointerup', (e) => {
            pressUp();
            clickFn(e);
        })
        .addListener('pointerupoutside', (e) => {
            pressUp();
            clickFn(e);
        })
        .addListener('pointerover', () => {
            pressDown();
        })
        .addListener('pointerout', () => {
            pressUp();
        });

    return obj;
}
