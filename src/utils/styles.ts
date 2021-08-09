import dPathParser from 'd-path-parser';
import RoughType from 'roughjs';
import { OpSet } from 'roughjs/bin/core';
import rough from 'roughjs/bundled/rough.esm';

import * as PIXI from 'pixi.js';

declare type RoughGenerator = ReturnType<typeof RoughType.generator>;
declare type RoughDrawable = ReturnType<RoughGenerator['rectangle']>;

// 手绘风格渲染组件实例
const generator = rough.generator(undefined);
const roughGeneratorInstance = generator;

export const roughGenerator = roughGeneratorInstance;

// 将 SVG PATH 转换成可绘制对象
export function getPathRoughDrawable(path: string): RoughDrawable {
    return roughGenerator.path(path);
}

function parsePath(renderObject: PIXI.Graphics, d: string): PIXI.Graphics {
    let x: number = 0;
    let y: number = 0;

    const commands = dPathParser(d.trim());

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];

        switch (command.code) {
            case 'm': {
                renderObject.moveTo((x += command.end.x), (y += command.end.y));
                break;
            }
            case 'M': {
                renderObject.moveTo((x = command.end.x), (y = command.end.y));
                break;
            }
            case 'H': {
                renderObject.lineTo((x = command.value), y);
                break;
            }
            case 'h': {
                renderObject.lineTo((x += command.value), y);
                break;
            }
            case 'V': {
                renderObject.lineTo(x, (y = command.value));
                break;
            }
            case 'v': {
                renderObject.lineTo(x, (y += command.value));
                break;
            }
            case 'Z': {
                renderObject.closePath();
                break;
            }
            case 'L': {
                renderObject.lineTo((x = command.end.x), (y = command.end.y));
                break;
            }
            case 'l': {
                renderObject.lineTo((x += command.end.x), (y += command.end.y));
                break;
            }
            case 'C': {
                renderObject.bezierCurveTo(
                    command.cp1.x,
                    command.cp1.y,
                    command.cp2.x,
                    command.cp2.y,
                    (x = command.end.x),
                    (y = command.end.y),
                );
                break;
            }
            case 'c': {
                const currX = x;
                const currY = y;

                renderObject.bezierCurveTo(
                    currX + command.cp1.x,
                    currY + command.cp1.y,
                    currX + command.cp2.x,
                    currY + command.cp2.y,
                    (x += command.end.x),
                    (y += command.end.y),
                );
                break;
            }
            case 's':
            case 'q': {
                const currX = x;
                const currY = y;

                renderObject.quadraticCurveTo(
                    currX + command.cp.x,
                    currY + command.cp.y,
                    (x += command.end.x),
                    (y += command.end.y),
                );
                break;
            }
            case 'S':
            case 'Q': {
                renderObject.quadraticCurveTo(
                    command.cp.x,
                    command.cp.y,
                    (x = command.end.x),
                    (y = command.end.y),
                );
                break;
            }
            case 'a': {
                const RAD = Math.PI / 180;

                renderObject.arc(
                    (x += command.end.x),
                    (y += command.end.y),
                    command.rotation * RAD,
                    command.radii.x * RAD,
                    command.radii.y * RAD,
                    command.clockwise,
                );
                break;
            }
            case 'A': {
                const RAD = Math.PI / 180;

                renderObject.arc(
                    (x = command.end.x),
                    (y = command.end.y),
                    command.rotation * RAD,
                    command.radii.x * RAD,
                    command.radii.y * RAD,
                    command.clockwise,
                );
                break;
            }
            default: {
                // eslint-disable-next-line no-console
                console.info(
                    '[PIXI.SVG] Draw command not supported:',
                    command.code,
                    command,
                );
                break;
            }
        }
    }

    return renderObject;
}

function loopV1(step: OpSet, renderObject: PIXI.Graphics): void {
    step.ops.forEach(({ op, data }) => {
        const [cp1x, cp1y, cp2x, cp2y, x, y] = data;
        switch (op) {
            case 'bcurveTo':
                renderObject.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                break;
            case 'lineTo':
                renderObject.lineTo(cp1x, cp1y);
                break;
            case 'move':
                renderObject.moveTo(cp1x, cp1y);
                break;
            default:
                break;
        }
    });
}

export function drawRoughV1(
    renderObject: PIXI.Graphics,
    draw: RoughDrawable,
): PIXI.Graphics {
    draw.sets.forEach((step) => {
        loopV1(step, renderObject);
    });
    return renderObject;
}

// 手绘风格渲染
export function drawRoughV2(
    renderObject: PIXI.Graphics,
    draw: RoughDrawable,
    inherit: boolean = false,
): PIXI.Graphics {
    const paths = generator.toPaths(draw);
    paths.forEach(({ d, stroke, strokeWidth, fill }) => {
        if (fill) {
            if (fill === 'none') {
                renderObject.beginFill(0);
            } else {
                renderObject.beginFill(PIXI.utils.string2hex(fill));
            }
        }
        renderObject.lineStyle({
            width: inherit ? renderObject.line.width : strokeWidth,
            color: inherit
                ? renderObject.line.color
                : PIXI.utils.string2hex(stroke),
            cap: renderObject.line.cap,
            join: renderObject.line.join,
            miterLimit: renderObject.line.miterLimit,
        });
        parsePath(renderObject, d);
    });

    return renderObject;
}
