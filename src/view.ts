import SPaintDoc,{SPoint, SShapeStyle}  from "./dom";
import SController from "./controller";

class SView {
    properties = {lineWidth: 1, lineColor: "black"};
    controllers: Map<string, SController>;
    onMouseDown: EventListener | null;
    onMouseUp: EventListener | null;
    onMouseMove: EventListener | null;
    onDblClick: EventListener | null;
    onKeyDown: EventListener | null;
    drawing: HTMLCanvasElement;
    doc: SPaintDoc;

    _current: SController | null;
    _currentKey: string;
  
    constructor() {
        this.onDblClick = null;
        this.onMouseUp = null;
        this.onMouseMove = null;
        this.onKeyDown = null;
        this.onMouseDown = null;

        let drawing = document.getElementById("drawing") as HTMLCanvasElement;
        let view = this;
        drawing.onmousedown = function(event) {
            event.preventDefault()
            if (view.onMouseDown != null) {
                view.onMouseDown(event);
            }
        }

        drawing.onmouseup = function(event) {
            event.preventDefault();
            if (view.onMouseUp != null) {
                view.onMouseUp(event)
            }
        }

        drawing.onmousemove = function(event) {
            event.preventDefault();
            if (view.onMouseMove != null) {
                view.onMouseMove(event)
            }
        }

        drawing.ondblclick = function(event) {
            event.preventDefault();
            if (view.onDblClick != null) {
                view.onDblClick(event);
            }
        }

        drawing.onkeydown = function(event) {
            event.preventDefault();
            if (view.onKeyDown != null) {
                view.onKeyDown(event);
            }
        }

        document.onkeydown = function(event) {

            console.log((event.key));

            switch(event.key) {
                case "Escape": 
                    event.preventDefault()
            }

            if (view.onKeyDown != null) {
                view.onKeyDown(event);
            }

        }

        this.drawing = drawing;
        this.doc = new SPaintDoc();
        this.controllers = new Map();

        this._currentKey = "";
        this._current = null;

        this.invokeController("ShapeSelector");
    }

    _setCurrent(name: string, controller: SController) {
        this._currentKey = name;
        this._current = controller;
    }

    onPaint(ctx: CanvasRenderingContext2D) {
        this.doc.onPaint(ctx);
        if (this._current != null) {
            this._current.onPaint(ctx);
        }
    }

    registerController(name:string, controller: SController) {
        if (this.controllers.has(name)) {
            alert("Controller exists: " + name);
        } else {
            console.log("add controller " + name + "; current size " + this.controllers.size)
            this.controllers.set(name, controller);
        }
    }

    get lineStyle() {
        return new SShapeStyle(this.properties.lineWidth, this.properties.lineColor);
    }

    invokeController(name:string) {
        console.log("invoke controller: " + name);
        if (this.controllers.has(name)) {
            let controller = this.controllers.get(name)!;
            controller.start();
            this._setCurrent(name, controller);
        } else {
            console.log(`Controller ${name} does not exist`);
        }
    }

    stopController() {
        if (this._current != null) {
            this._current.stop();
        }
        this._current = null;
        this._currentKey = "";
    }

    getMousePos(event: MouseEvent): SPoint {
        return {x: event.offsetX, y: event.offsetY};

    }

    invalidate() {
        let ctx = this.drawing.getContext("2d")!; 
        let rect = this.drawing.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        this.onPaint(ctx);

    }

    onControllerReset() {
        this.invokeController("ShapeSelector");
    }
}

export default SView;