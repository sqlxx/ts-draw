import SController from ".";
// import { Shape } from "../dom";
import SView from "../view";

class ShapeSelector implements SController {

    private moving: boolean = false;
    // private selection: Shape;
    private view: SView;

    constructor(view: SView) {
        this.view = view;
    }

    onPaint(_ctx: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.");
    }

    onDblClick(_event: Event): void {
        // Do nothing
    }
    onMouseMove(event: Event): void {
        const pt = this.view.getMousePos(event as MouseEvent);

        if (!this.moving) {
            let hitResult = this.view.doc.hitTest(pt);
            if (hitResult.hit) {
                this.view.drawing.style.cursor = "move"
            } else {
                this.view.drawing.style.cursor = "auto"
            }
        } else {
        }
    }
    onMouseUp(_event: Event): void {
        throw new Error("Method not implemented.");
    }
    onMouseDown(_event: Event): void {
        throw new Error("Method not implemented.");
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