class LineStyle {
  width: number;
  color: string;

  constructor(width:number, color:string) {
      this.width = width;
      this.color = color;
  }
}

interface Point {
  x: number;
  y: number;
}

class Line {
  pt1: Point;
  pt2: Point;
  lineStyle: LineStyle;

  constructor(point1:Point, point2:Point, lineStyle: LineStyle) {
      this.pt1 = point1
      this.pt2 = point2
      this.lineStyle = lineStyle
  }

  onPaint(ctx: CanvasRenderingContext2D) {
      let lineStyle = this.lineStyle
      ctx.lineWidth = lineStyle.width
      ctx.strokeStyle = lineStyle.color
      ctx.beginPath()
      ctx.moveTo(this.pt1.x, this.pt1.y)
      ctx.lineTo(this.pt2.x, this.pt2.y)
      ctx.stroke()
  }
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

class Rect {

  x: number;
  y: number;
  width: number;
  height: number;
  lineStyle: LineStyle;

  constructor(rect: Area, lineStyle: LineStyle) {
      this.x = rect.x;
      this.y = rect.y;
      this.width = rect.width;
      this.height = rect.height;
      this.lineStyle = lineStyle;

  }
}
