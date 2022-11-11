interface SController {
    // paint the current temp shape

    onPaint(ctx:CanvasRenderingContext2D): void;
    start():void;
    stop():void;
    onDblClick(event:Event): void;
    onMouseMove(event: Event): void;
    onMouseUp(event: Event): void;
    onMouseDown(event: Event): void;
    onKeyDown(event: Event): void;
}

export default SController;

