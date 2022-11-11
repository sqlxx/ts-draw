export type SPoint = { 
    x: number;
    y: number;
}

export interface Shape {
    onPaint(ctx: CanvasRenderingContext2D): void;
    isHit(pt:SPoint):boolean;
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
    // fillColor: string;

    constructor(lineWidth: number, lineColor: string) {
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        // this.fillColor = fillColor;
    }
}

function isHitLine(pt: SPoint, pt1: SPoint, pt2: SPoint, lineWidth: number): boolean {
    if ((pt1.x - pt.x)*(pt.x - pt2.x) < 0) {
        return false;
    }

    if ((pt1.y - pt.y)*(pt2.y - pt2.y) < 0) {
        return false;
    }

    let a = pt2.y-pt1.y
    let b = pt1.x-pt2.x
    let c = pt2.x*pt1.y - pt1.x*pt2.y 
    
    // 使用点到线段的距离公式 |ax0+by0+c|/sqrt(a^2 + b^2)
    let d = Math.abs(a*pt.x + b*pt.y+c)/Math.sqrt(a*a + b*b)

    return lineWidth >= 2*(d-2)

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
    isHit(pt: SPoint): boolean {
        return isHitLine(pt, this.pt1, this.pt2, this.lineStyle.lineWidth);
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

    isHit(_pt: SPoint): boolean {
        return false;
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

    isHit(_pt: SPoint): boolean {
        return false;
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

    isHit(pt: SPoint): boolean {
        let lastIdx = this.points.length - 1;
        for (let i = 0; i < lastIdx -1; i ++) {
            if (isHitLine(pt, this.points[i], this.points[i+1], this.lineStyle.lineWidth)) {
                return true;
            }
        }

        return false;
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

type HitResult = {
    hit: boolean;
    shape: Shape | null;
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

    hitTest(pt: SPoint): HitResult {
        for (let shape of this.shapes) {
            let isHit = shape.isHit(pt);
            if (isHit) {
                return {hit:true, shape: shape}
            } 
        }

        return {hit: false, shape: null};
    }
  }

  export default SPaintDoc;