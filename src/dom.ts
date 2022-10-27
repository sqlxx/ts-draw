interface SPoint {
    x: number;
    y: number;
}

interface Shape {
    onPaint(ctx: CanvasRenderingContext2D): void;
}

interface RegionByHW {
    x: number;
    y: number;
    height: number;
    width: number;
}

interface RegionByPts {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

class SLineStyle {
    width: number;
    color: string;

    constructor(width: number, color: string) {
        this.width = width;
        this.color = color;
    }
}

class SLine implements Shape {
    pt1: SPoint;
    pt2: SPoint;
    lineStyle: SLineStyle;

    constructor(pt1: SPoint, pt2: SPoint, lineStyle: SLineStyle) {
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.lineStyle = lineStyle;
    }

    onPaint(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineStyle.width;
        ctx.strokeStyle = this.lineStyle.color;

        ctx.beginPath();
        ctx.moveTo(this.pt1.x, this.pt1.y);
        ctx.lineTo(this.pt2.x, this.pt2.y);
        ctx.stroke;
    }
}

class SRect implements Shape {


    constructor()

    onPaint(ctx: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.");
    }

}