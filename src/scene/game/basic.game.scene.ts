import * as gsc from '@thi.ng/geom-subdiv-curve';
import { cloneDeep } from 'lodash';
import { StringBatcher } from 'stringbatcher';

import * as PIXI from 'pixi.js';

import { Game } from '../../game';
import Scene from '../../scene';
import { CloseIcon } from '../../utils/icons';
import { Round } from '../../utils/math';
import { bathMessage } from '../../utils/socket';
import { drawRoughV1, roughGenerator } from '../../utils/styles';
import { AddClick, autoScale, SetPosition } from '../../utils/ui';

import ErrCode = MGOBE.ErrCode;

interface StrokePath {
    x: number;
    y: number;
}

interface StrokeSave {
    color: number;
    width: number;
    points: StrokePath[];
    isSend: boolean;
}

/**
 * 基础绘画模式
 */
export class BasicGameScene extends Scene {
    name = 'basic.game';
    // 当前绘制的路径
    strokePath: StrokeSave = {
        color: 0,
        points: [],
        width: 1,
        isSend: false,
    };

    strokeSavePath: StrokeSave[] = [];

    strokeOptions: {
        color: number;
        width: number;
        type: number;
    } = {
        color: 0x000000,
        width: 1,
        type: 1,
    };

    // 笔画图层
    private strokePathCanvas: PIXI.Graphics = new PIXI.Graphics();
    // 拖动数据
    private dragData: PIXI.InteractionData | undefined;
    // 是否拖动
    private dragging: boolean = false;
    // 是否产生拖动
    private isMove: boolean = false;
    // 缩放比列
    private ratio: number = 1;
    private canvas!: PIXI.Graphics;
    private overflowHidden!: PIXI.Graphics;
    private nowLine!: PIXI.Graphics;
    private readonly sender: StringBatcher;

    constructor(public game: Game) {
        super(game);
        this.initCanvas();
        this.sender = bathMessage(420)((chunk) => {
            const frame = {
                chunk: 1,
            };
            this.game.backend.room.sendFrame({ data: frame }, (event) => {
                if (event.code === ErrCode.EC_OK) {
                    console.log('发送成功', event);
                } else {
                    console.log('发送失败', event);
                }
            });
        });
    }

    load(): void {
        this.container.addChild(this.canvas);

        const close = AddClick(
            SetPosition(CloseIcon(), 0.98, 0.03, this.game.screen),
            (e) => {
                this.game.sceneManager.active('start');
            },
        );
        this.container.addChild(close);
    }

    sendPath(): void {
        // const frame = { paths: [1, 2, 3] };
        const data = JSON.stringify(
            this.strokeSavePath.reduce<StrokeSave[]>((result, i, index) => {
                if (!i.isSend) {
                    this.strokeSavePath[index].isSend = true;
                    result.push(i);
                }
                return result;
            }, []),
        );
        console.log(data);
        this.sender.process(data);
    }

    start(): void {
        this.game.backend.room.startFrameSync({}, (event) => {
            if (event.code === ErrCode.EC_OK) {
                console.log('开始游戏 成功');
            } else {
                console.log('开始游戏 失败');
            }
        });
        this.game.backend.room.onStartFrameSync = (event) => {
            console.log('开始帧同步');
        };
        this.game.backend.room.onRecvFrame = ({
            data: {
                frame: { id, items },
            },
        }) => {
            if (items.length) {
                console.log('帧广播', id, items);
            }
        };
    }

    renderStrokePath(line: StrokeSave): PIXI.Graphics {
        const points = line.points.map((i) => {
            return [i.x * this.ratio, i.y * this.ratio];
        });

        const renderPoints = gsc.subdivide(points, {
            fn: gsc.kernel3([1 / 8, 3 / 4, 1 / 8], [0, 1 / 2, 1 / 2]),
            size: 3,
        }) as number[][];

        const lineGraphics = new PIXI.Graphics();

        if (renderPoints.length) {
            const fistPoint = renderPoints[0];
            lineGraphics.lineStyle(line.width, line.color);
            lineGraphics.moveTo(fistPoint[0], fistPoint[1]);
            renderPoints.shift();
            renderPoints.forEach(([x, y]) => {
                lineGraphics.lineTo(x, y);
            });
        } else if (points.length) {
            const lineGraphics = new PIXI.Graphics();
            lineGraphics.lineStyle(0);
            lineGraphics.beginFill(line.color, 1);
            // lineGraphics.drawCircle(10, 10, 30);
            points.forEach(([x, y]) => {
                lineGraphics.drawCircle(x, y, line.width);
            });
            lineGraphics.endFill();
        }
        return lineGraphics;
    }

    private onDragStart(event: PIXI.InteractionEvent): void {
        this.dragData = event.data;
        this.dragging = true;
    }

    private onDrag(event: PIXI.InteractionEvent): void {
        if (this.dragging) {
            this.addMousePoint();
            this.isMove = true;
        }
    }

    private addMousePoint(): void {
        const mouse = (this.dragData as PIXI.InteractionData).getLocalPosition(
            this.canvas,
        );
        const [x, y] = [mouse.x, mouse.y].map((i) => Round(i / this.ratio, 0));

        this.strokePath.color = this.strokeOptions.color;
        this.strokePath.width = this.strokeOptions.width;

        this.strokePath.points.push({
            x,
            y,
        });
        if (this.nowLine) {
            this.canvas.removeChild(this.nowLine);
        }
        this.nowLine = this.renderStrokePath(this.strokePath);
        this.canvas.addChild(this.nowLine);
    }

    private onDragEnd(event: PIXI.InteractionEvent): void {
        if (!this.isMove) {
            this.addMousePoint();
        }
        this.dragging = false;
        this.dragData = undefined;
        this.isMove = false;
        this.strokeSavePath.push(cloneDeep(this.strokePath));
        this.strokePath.points = [];
        this.renderStrokeSavePath();
        this.sendPath();
    }

    private renderClear(): void {
        this.strokePathCanvas.children.forEach((path) => {
            this.strokePathCanvas.removeChild(path);
        });
    }

    private renderToolbar(): void {
        const itemSize = { width: 40, height: 40 };

        const items: PIXI.Graphics[] = [];

        const colors = [
            PIXI.utils.string2hex('#FF0000'),
            PIXI.utils.string2hex('#FF7F00'),
            PIXI.utils.string2hex('#FFFF00'),
            PIXI.utils.string2hex('#00FF00'),
            PIXI.utils.string2hex('#00FFFF'),
            PIXI.utils.string2hex('#0000FF'),
            PIXI.utils.string2hex('#8B00FF'),
        ];

        colors.forEach((color) => {
            const colorItem = new PIXI.Graphics();
            colorItem.width = 40;
            colorItem.height = 40;
            colorItem.interactive = true;
            const rough = roughGenerator.rectangle(
                0,
                0,
                itemSize.width,
                itemSize.height,
                {
                    fill: PIXI.utils.hex2string(color),
                    hachureAngle: 60,
                    hachureGap: 1,
                },
            );
            colorItem.lineStyle(1, color);
            colorItem.beginFill(color);
            drawRoughV1(colorItem, rough);
            AddClick(colorItem, () => {
                this.strokeOptions.color = color;
            });
            items.push(colorItem);
        });

        [1, 2, 3, 4, 5].forEach((size) => {
            const sizeItem = new PIXI.Graphics();
            sizeItem.width = 40;
            sizeItem.height = 40;
            sizeItem.interactive = true;

            const color = 0x000000;
            const rough = roughGenerator.rectangle(
                0,
                0,
                itemSize.width,
                itemSize.height,
                {
                    fill: PIXI.utils.hex2string(color),
                    hachureAngle: 60,
                    hachureGap: 1,
                },
            );
            sizeItem.lineStyle(1, color);
            sizeItem.beginFill(color);
            drawRoughV1(sizeItem, rough);

            sizeItem.beginFill(0xffffff);
            sizeItem.drawCircle(20, 20, 2 * size);
            sizeItem.endFill();
            AddClick(sizeItem, () => {
                this.strokeOptions.width = size * 2;
            });
            items.push(sizeItem);
        });

        items.forEach((item, index) => {
            autoScale(item, itemSize);

            const x =
                this.canvas.position.x +
                index * (itemSize.width + (index ? 20 : 0));

            const y = this.canvas.position.y - itemSize.height - 20;

            item.position.set(x, y);

            if (item.interactive) {
                item.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    item.width,
                    item.height,
                );
            }

            this.container.addChild(item);
        });
    }

    private initCanvas(): void {
        const maxWindow = {
            width: this.game.designWidth + 200,
            height: this.game.designHeight + 200,
        };

        const rateWindow = {
            width: this.game.screen.width / maxWindow.width,
            height: this.game.screen.height / maxWindow.height,
        };

        this.ratio =
            rateWindow.width < rateWindow.height
                ? rateWindow.width
                : rateWindow.height;

        const realWindow = {
            width: maxWindow.width * this.ratio,
            height: maxWindow.height * this.ratio,
        };

        this.canvas = new PIXI.Graphics();

        this.canvas.interactive = true;
        this.canvas.hitArea = new PIXI.Rectangle(
            0,
            0,
            realWindow.width,
            realWindow.height,
        );
        this.canvas.beginFill(0xffffff, 1);
        this.canvas.drawRect(0, 0, realWindow.width, realWindow.height);
        this.canvas.endFill();
        this.canvas.lineStyle(1, 0x000000, 1);
        const rough = roughGenerator.rectangle(
            0,
            0,
            realWindow.width,
            realWindow.height,
        );
        this.canvas = drawRoughV1(this.canvas, rough);

        this.canvas.scale.set(this.ratio, this.ratio);

        this.canvas.position.set(
            (this.game.screen.width - this.canvas.width) / 2,
            (this.game.screen.height - this.canvas.height) / 2,
        );

        this.overflowHidden = new PIXI.Graphics();

        this.overflowHidden.beginFill(0xffffff, 1);
        this.overflowHidden.drawRect(
            this.canvas.position.x + 2,
            this.canvas.position.y + 2,
            this.canvas.width - 2,
            this.canvas.height - 2,
        );
        this.overflowHidden.endFill();

        this.strokePathCanvas.mask = this.overflowHidden;

        this.strokePathCanvas.interactive = false;
        this.strokePathCanvas.buttonMode = false;

        this.canvas.addChild(this.strokePathCanvas);
        this.renderToolbar();
        this.addListener();
    }

    private addListener(): void {
        this.canvas
            .addListener('pointerdown', (e) => {
                this.onDragStart(e);
            })
            .addListener('pointermove', (e) => {
                this.onDrag(e);
            })
            .addListener('pointerup', (e) => {
                this.onDragEnd(e);
            })
            .addListener('pointerupoutside', (e) => {
                this.onDragEnd(e);
            });
    }

    private renderStrokeSavePath(): void {
        // 清理之前渲染的所有结果
        this.renderClear();

        // 线过长线段非常明显
        this.strokeSavePath.forEach((line, index) => {
            this.strokePathCanvas.addChild(this.renderStrokePath(line));
        });
    }
}
