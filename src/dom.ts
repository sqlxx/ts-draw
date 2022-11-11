export type SPoint = { 
    x: number;
    y: number;
}

export interface Shape {
    onPaint(ctx: CanvasRenderingContext2D): void;
}

export type RegionByHW = {
    x: number;
    y: number;
    height: number;
    width: number;
}

export type RegionByPts = {
    pt1: SPoint;
    pt2: SPoint;
}

export class SShapeStyle {
    lineWidth: number;
    lineColor: string;
    fillColor: string;

    constructor(lineWidth: number, lineColor: string, fillColor: string) {
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this.fillColor = fillColor;
    }
}

export class SLine implements Shape {
    pt1: SPoint;
    pt2: SPoint;
    lineStyle: SShapeStyle;

    constructor(pt1: SPoint, pt2: SPoint, lineStyle: SShapeStyle) {
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.lineStyle = lineStyle;
    }

    onPaint(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineStyle.lineWidth;
        ctx.strokeStyle = this.lineStyle.lineColor;

        ctx.beginPath();
        ctx.moveTo(this.pt1.x, this.pt1.y);
        ctx.lineTo(this.pt2.x, this.pt2.y);
        ctx.stroke();
    }
}

export class SRect implements Shape {
    rect: RegionByHW;
    lineStyle: SShapeStyle;

    constructor(r: RegionByHW, lineStyle: SShapeStyle) {
        this.rect = r;
        this.lineStyle = lineStyle;
        
    }

    onPaint(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineStyle.lineWidth;
        ctx.strokeStyle = this.lineStyle.lineColor;

        ctx.beginPath();
        ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.stroke();
    }

}

export class SEllipse implements Shape {

    center: SPoint;
    radiusX: number;
    radiusY: number;
    lineStyle: SShapeStyle;
    
    constructor(center: SPoint, radiusX: number, radiusY: number, lineStyle: SShapeStyle) {
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.lineStyle = lineStyle;

    }

    onPaint(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineStyle.lineWidth;
        ctx.strokeStyle = this.lineStyle.lineColor;

        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.radiusX, this.radiusY, 0, 0, 360);
        ctx.stroke();
    }

}

export class SPath implements Shape {
    points: SPoint[];
    lineStyle: SShapeStyle;

    constructor(points: SPoint[], lineStyle: SShapeStyle) {
        this.points = points;
        this.lineStyle = lineStyle;
    }

    onPaint(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineStyle.lineWidth;
        ctx.strokeStyle = this.lineStyle.lineColor;

        if (this.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);

            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }

        ctx.stroke();
    }
}

class SPaintDoc {
    shapes: Shape[] = [];
  
    addShape(shape: Shape): void {
      this.shapes.push(shape);
    }
  
    onPaint(ctx: CanvasRenderingContext2D): void {
      let n = this.shapes.length;
      for (let i = 0; i < n; i ++) {
        this.shapes[i].onPaint(ctx);
      }
    }
  }

  export default SPaintDoc;