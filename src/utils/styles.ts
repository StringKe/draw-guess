import rough from 'roughjs/bundled/rough.esm';

import * as PIXI from 'pixi.js'
import RoughType from 'roughjs';

declare type RoughGenerator = ReturnType<typeof RoughType.generator>;
declare type RoughDrawable = ReturnType<RoughGenerator["rectangle"]>;

const generator = rough.generator(undefined);
const roughGeneratorInstance = generator as RoughGenerator;

export const roughGenerator = roughGeneratorInstance;

export function drawRough(renderObject: PIXI.Graphics, draw: RoughDrawable) {
    draw.sets.forEach(step => {
        switch (step.type) {
            case 'path':
                step.ops.forEach(({op, data}) => {
                    const [cp1x, cp1y, cp2x, cp2y, x, y] = data;
                    switch (op) {
                        case "bcurveTo":
                            renderObject.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
                            break;
                        case "lineTo":
                            renderObject.lineTo(cp1x, cp1y)
                            break;
                        case "move":
                            renderObject.moveTo(cp1x, cp1y)
                            break;
                        default:
                            break;
                    }
                })
                break;
            case 'fillPath':
                break;
            case 'fillSketch':
                break;
            default:
                break;
        }
    });
    return renderObject;
}
