import { CurveInterpolator } from 'curve-interpolator';

import * as PIXI from 'pixi.js';

import { Game } from '../../game';
import Scene from '../../scene';
import { drawRough, roughGenerator } from '../../utils/styles';

interface StrokePath {
    color: number;
    x: number;
    y: number;
    width: number;
    isRender: boolean;
}

/**
 * 基础绘画模式
 */
export class BasicGameScene extends Scene {
    name = 'basic.game';
    strokePath: StrokePath[] = [];
    private strokePathCanvas: PIXI.Graphics = new PIXI.Graphics();
    private dragData: PIXI.InteractionData | undefined;
    private dragging: boolean = false;
    private ratio: number = 1;
    private isMove: boolean = false;
    private canvas!: PIXI.Graphics;
    private overflowHidden!: PIXI.Graphics;

    constructor(public game: Game) {
        super(game);
        this.initCanvas();
    }

    initCanvas(): void {
        const maxWindow = {
            width: this.game.designWidth,
            height: this.game.designHeight,
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
        this.canvas = drawRough(
            this.canvas,
            roughGenerator.rectangle(0, 0, realWindow.width, realWindow.height),
        );

        this.canvas.scale.set(this.ratio, this.ratio);

        this.canvas.position.set(
            (this.game.screen.width - this.canvas.width) / 2,
            (this.game.screen.height - this.canvas.height) / 2,
        );

        this.overflowHidden = new PIXI.Graphics();

        this.overflowHidden.beginFill(0xffffff, 1);
        this.overflowHidden.drawRect(
            this.canvas.position.x + 1,
            this.canvas.position.y + 1,
            this.canvas.width - 1,
            this.canvas.height - 1,
        );
        this.overflowHidden.endFill();

        this.strokePathCanvas.mask = this.overflowHidden;

        this.strokePathCanvas.interactive = false;
        this.strokePathCanvas.buttonMode = false;

        this.canvas.addChild(this.strokePathCanvas);
        this.addListener();
    }

    load(): void {
        this.container.addChild(this.canvas);
    }

    onDragStart(event: PIXI.InteractionEvent): void {
        this.dragData = event.data;
        this.dragging = true;
    }

    onDrag(event: PIXI.InteractionEvent): void {
        if (this.dragging) {
            this.addMousePoint();
            this.isMove = true;
        }
    }

    addMousePoint(): void {
        const mouse = (this.dragData as PIXI.InteractionData).getLocalPosition(
            this.canvas,
        );
        const [x, y] = [mouse.x, mouse.y].map((i) => i / this.ratio);

        this.strokePath.push({
            width: 1,
            x,
            y,
            color: 0x000000,
            isRender: false,
        });
        this.renderStrokePath();
    }

    onDragEnd(event: PIXI.InteractionEvent): void {
        if (!this.isMove) {
            this.addMousePoint();
        }
        this.dragging = false;
        this.dragData = undefined;
        this.isMove = false;
    }

    private addListener(): void {
        this.canvas
            .addListener('pointerdown', (e) => {
                console.log('pointerdown');
                this.onDragStart(e);
            })
            .addListener('pointermove', (e) => {
                this.onDrag(e);
            })
            .addListener('pointerup', (e) => {
                console.log('pointerup');
                this.onDragEnd(e);
            })
            .addListener('pointerupoutside', (e) => {
                console.log('pointerupoutside');
                this.onDragEnd(e);
            });
    }

    private renderStrokePath(): void {
        // 清理之前渲染的所有结果
        this.strokePathCanvas.children.forEach((path) => {
            this.strokePathCanvas.removeChild(path);
        });
        const rawPoints = this.strokePath.map((i) => [i.x, i.y]);
        const interp = new CurveInterpolator(rawPoints, { tension: 0.2 });
        const points = interp.getPoints();
        this.strokePathCanvas.moveTo(points[0][0], points[0][1]);
        this.strokePathCanvas.lineStyle(1, 0x000000);
        points.forEach(([x, y]: number[]) => {
            this.strokePathCanvas.lineTo(x * this.ratio, y * this.ratio);
        });
        // this.strokePathCanvas.closePath();
        // this.strokePathCanvas.beginFill(0x000000);
        // this.strokePath.map(({ color, x, y, isRender, width }, index) => {
        //   if (!isRender && index < this.strokePath.length - 1) {
        //     this.strokePathCanvas.lineStyle(width, color);
        //     this.strokePathCanvas.drawCircle(x * this.ratio, y * this.ratio, 1);
        //     this.strokePath[index].isRender = true;
        //   }
        // });
        // this.strokePathCanvas.endFill();
    }
}
