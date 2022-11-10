import SView from "../view";
import {RegionByPts, Shape, SRect, SEllipse, RegionByHW, SLine} from "../dom";

interface SController {
    // paint the current temp shape

    onPaint(ctx:CanvasRenderingContext2D): void;
    stop():void;
    onDblClick(event:Event): void;
    onMouseMove(event: Event): void;
    onMouseUp(event: Event): void;
    onMouseDown(event: Event): void;
    onKeyDown(event: Event): void;
    start():void;
}

// Support create rectangle, circle, ellipse
class RectCreator implements SController {

    private view: SView;
    private shapeType: string;
    private started: boolean;
    private rect: RegionByPts;

    constructor(view: SView, shapeType: string) {
        this.started = false;
        this.view = view;
        this.shapeType = shapeType;
        this.reset();
    }
    reset(): void {
        this.rect = {
            pt1: {x: 0, y: 0},
            pt2: {x: 0, y: 0}
        } 
    }
    start(): void {
        let ctrl = this;
        this.view.onMouseMove = function(event) {ctrl.onMouseMove(event)};
        this.view.onMouseUp = function(event) {ctrl.onMouseUp(event)};
        this.view.onMouseDown = function(event) {ctrl.onMouseDown(event)};
        this.view.onKeyDown = function(event) { ctrl.onKeyDown(event)}
    }
    onKeyDown(_event: Event): void {
        if (this.started) {
            //TODO: esc to cancel the drawing
        }
    }

    onMouseUp(_event: Event): void {
        if (this.started) {
            this.rect.pt2 = this.view.getMousePos(event as MouseEvent);
            let shape = this.buildShape();
            this.view.doc.addShape(shape);
            this.view.invalidate();
            this.started = false;
            this.reset();
        }
    }
    onMouseDown(event: Event): void {
        this.rect.pt1 = this.view.getMousePos(event as MouseEvent);
        this.started = true;
    }
    onDblClick(_event: Event): void {
        // Do nothing
    }
    onMouseMove(event: Event): void {
        if (this.started) {
            this.rect.pt2 = this.view.getMousePos(event as MouseEvent);
            this.view.invalidate();
        }
    }

    buildShape(): Shape {
        switch(this.shapeType) {
            case "line":
                return new SLine(this.rect.pt1, this.rect.pt2, this.view.lineStyle);
            case "rect": { 
                let rectByWH = this.normalizeRect(this.rect);
                return new SRect(rectByWH, this.view.lineStyle);
            }
            case "ellipse": {
                let rectByWH = this.normalizeRect(this.rect);
                let center = {x: rectByWH.x + rectByWH.width/2, y: rectByWH.y + rectByWH.height/2};
                let radiusX = rectByWH.width/2;
                let radiusY = rectByWH.height/2;
                return new SEllipse(center, radiusX, radiusY, this.view.lineStyle);
            }
            case "circle": {
                let rectByWH = this.normalizeRect(this.rect);
                let center = {x: rectByWH.x + rectByWH.width/2, y: rectByWH.y + rectByWH.height/2};
                let radius = rectByWH.width/2;
                return new SEllipse(center, radius, radius, this.view.lineStyle);
            }
            default: 
                throw new Error("Unknown shape type: " + this.shapeType);
        }

    }

    normalizeRect(rectByPts: RegionByPts): RegionByHW {
        let x = rectByPts.pt1.x;
        let y = rectByPts.pt1.y;

        let width = rectByPts.pt2.x - x;
        let height = rectByPts.pt2.y - y;

        if (width < 0) {
            x = rectByPts.pt2.x;
            width = - width;
        }

        if (height < 0) {
            y = rectByPts.pt2.y;
            height = -height;
        }

        return {x: x, y: y, width: width, height: height};

    }

    stop(): void {
        this.view.onMouseUp = null;
        this.view.onMouseDown = null;
        this.view.onMouseMove = null;
        this.view.onDblClick = null;
        this.rect = {
            pt1: {x: 0, y: 0},
            pt2: {x: 0, y: 0}
        }
    }

    onPaint(ctx: CanvasRenderingContext2D): void {
        this.buildShape().onPaint(ctx);
    }

}

export default RectCreator;