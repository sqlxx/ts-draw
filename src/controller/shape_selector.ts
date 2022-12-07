import SController from ".";
import { Shape, SPoint } from "../dom";
// import { Shape } from "../dom";
import SView from "../view";

class ShapeSelector implements SController {

    private moving: boolean = false;
    private selection: Shape | null = null;
    private view: SView;
    private mousePos: SPoint = {x:0, y:0};
    private offsetX: number = 0;
    private offsetY: number = 0;

    constructor(view: SView) {
        this.view = view;
    }

    onPaint(ctx: CanvasRenderingContext2D): void {

        if (this.selection != null) {

            let selectRegion = this.selection.getBound();

            if (selectRegion!= null) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "gray";
                ctx.setLineDash([2, 2]);

                ctx.beginPath();
                ctx.rect(this.mousePos.x, this.mousePos.y, selectRegion.width, selectRegion.height);
                ctx.stroke();

                ctx.setLineDash([]);

            } else {
                console.log('select region is null, should not happen');
            }

        }

    }

    onDblClick(_event: Event): void {
        // Do nothing
    }
    onMouseMove(event: Event): void {
        const pt = this.view.getMousePos(event as MouseEvent);

        if (!this.moving) {
            let hitResult = this.view.doc.hitTest(pt);
            console.log(hitResult);
            if (hitResult.hit) {
                this.view.drawing.style.cursor = "move"
            } else {
                this.view.drawing.style.cursor = "auto"
            }
        } else {

            this.mousePos = {x: pt.x - this.offsetX, y: pt.y - this.offsetY};
            this.view.invalidate();
        }
    }
    onMouseUp(event: Event): void {
        if (this.selection != null && this.moving) {
            const pt = this.view.getMousePos(event as MouseEvent);
            let bound = this.selection!.getBound();
            let dx = pt.x - this.offsetX - bound!.x;
            let dy = pt.y - this.offsetY - bound!.y;

            this.selection.move(dx, dy);
            this.moving = false;

            this.selection = null;
            this.view.invalidate();
        }
    }
    onMouseDown(_event: Event): void {
        const pt = this.view.getMousePos(event as MouseEvent);

        let hitResult = this.view.doc.hitTest(pt);
        console.log(hitResult);
        if (hitResult.hit) {
            this.selection = hitResult.shape;

            let bound = hitResult.shape!.getBound()!;
            this.offsetX = pt.x - bound.x;
            this.offsetY = pt.y - bound.y;

        }
        this.moving = true;
    }
    onKeyDown(_event: Event): void {
        throw new Error("Method not implemented.");
    }

    start(): void {
        let ctrl = this;
        this.view.onMouseMove = function(event) {ctrl.onMouseMove(event)};
        this.view.onMouseUp = function(event) {ctrl.onMouseUp(event)};
        this.view.onMouseDown = function(event) {ctrl.onMouseDown(event)};
        this.view.onKeyDown = function(event) { ctrl.onKeyDown(event as KeyboardEvent)}
    }

    stop(): void {
        this.view.onMouseMove = null;
        this.view.onMouseUp = null;
        this.view.onMouseDown = null;
        this.view.onKeyDown = null;
        this.view.drawing.style.cursor = "auto";
    }

}

export default ShapeSelector;