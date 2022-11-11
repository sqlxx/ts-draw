import SView from "../view";
import { SPath, SPoint } from "../dom";
import SController from ".";

class PathCreator implements SController {

    private points: SPoint[]
    private view: SView;
    private started: boolean = false;
    private lastPt: SPoint | null;

    constructor(view: SView) {
        this.view = view;
        this.points = [];
        this.lastPt = null;

    }

    buildShape(): SPath {
        return new SPath(this.points, this.view.lineStyle);
    }
    onPaint(ctx: CanvasRenderingContext2D): void {
        if (this.points.length > 0) {
            ctx.strokeStyle = this.view.lineStyle.lineColor;
            ctx.lineWidth = this.view.lineStyle.lineWidth;

            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);

            for (let i = 1; i < this.points.length; i ++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }

            ctx.lineTo(this.lastPt!.x, this.lastPt!.y);
            ctx.stroke();
        }

    }
    stop(): void {
        this.points = [];
        this.view.onMouseMove = null;
        this.view.onMouseUp = null;
        this.view.onMouseDown = null;
        this.view.onDblClick = null;
        this.view.onKeyDown = null;

    }
    onDblClick(_event: Event): void {
        if (this.started) {
            this.started = false;
            this.points.push(this.lastPt!);
            this.view.doc.addShape(this.buildShape());
            this.points = [];
            this.view.invalidate();

            this.view.onControllerReset();
        }
    }
    onMouseMove(event: Event): void {
        if (this.started) {
            this.lastPt = this.view.getMousePos(event as MouseEvent);
            this.view.invalidate();
        }
    }
    onMouseUp(event: Event): void {
        if (this.started) {
            const pos = this.view.getMousePos(event as MouseEvent);
            this.points.push(pos);
        }
    }
    onMouseDown(_event: Event): void {
        this.started = true;
    }
    onKeyDown(event: KeyboardEvent): void {
        if (this.started) {
            if (event.key === "Escape") {
                this.started = false;
                this.points = [];
                this.view.invalidate();
            }
        }
    }
    start(): void {
        let ctrl = this;
        this.view.onMouseMove = function(event) {ctrl.onMouseMove(event)};
        this.view.onMouseUp = function(event) {ctrl.onMouseUp(event)};
        this.view.onMouseDown = function(event) {ctrl.onMouseDown(event)};
        this.view.onDblClick = function(event) {ctrl.onDblClick(event)};
        this.view.onKeyDown = function(event) { ctrl.onKeyDown(event as KeyboardEvent)}}

}

export default PathCreator;