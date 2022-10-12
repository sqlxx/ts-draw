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

interface Shape {
  onPaint(ctx: CanvasRenderingContext2D): void;
}

class Line implements Shape {
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

interface RectByLength {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RectByPoints {
  p1: Point;
  p2: Point;
}
class View {
  properties: {lineWidth: number, lineColor: string};
  shapes: Shape[] = [];
  currentKey: string = "line";
  drawing: HTMLCanvasElement;

  constructor() {
    this.drawing = document.getElementById("drawing") as HTMLCanvasElement; 
    this.currentKey = "";

    this.properties = {
      lineWidth: 1,
      lineColor: "black"
    };
  }

  getLineStyle() {
    return new LineStyle(this.properties.lineWidth, this.properties.lineColor);
  }

  addShape(shape: Shape) {
    if (shape != null) {
      this.shapes.push(shape);
    }
  }

  invalidate(reserved: RectByPoints| null) {
    let ctx:CanvasRenderingContext2D = this.drawing.getContext("2d")!;
    let bound = this.drawing.getBoundingClientRect();

    ctx.clearRect(0, 0, bound.width, bound.height);
    console.log(reserved)

    this.onPaint(ctx);
  }

  onPaint(ctx: CanvasRenderingContext2D) {
    let shapes = this.shapes;

    for (let i in shapes) {
      shapes[i].onPaint(ctx);
    }

    switch(this.currentKey) {
      case "PathCreator":
        if (pathCreator.started) {
          let props = this.properties;
          ctx.lineWidth = props.lineWidth;
          ctx.strokeStyle = props.lineColor;
          ctx.beginPath();
          ctx.moveTo(pathCreator.fromPos.x, pathCreator.fromPos.y);
          for (let i in pathCreator.points) {
            ctx.lineTo(pathCreator.points[i].x, pathCreator.points[i].y);
          }
          ctx.lineTo(pathCreator.toPos.x, pathCreator.toPos.y);
          if (pathCreator.close) {
            ctx.closePath();
          }
          ctx.stroke();
        }
        return;
      case "RectCreator": 
      case "LineCreator":
      case "EllipseCreator":
      case "CircleCreator":
        if (rectCreator.started) {
          rectCreator.buildShape().onPaint(ctx);
        }
    }
  }

  mousedown(event: MouseEvent) {

    switch(this.currentKey) {
      case "PathCreator":
        pathCreator.toPos = this.getMousePos(event)
        if (pathCreator.started) {
          pathCreator.points.push(pathCreator.toPos);
        } else {
          pathCreator.fromPos = pathCreator.toPos;
          pathCreator.started = true;
        }
        this.invalidate(null);
        return;
      case "RectCreator":
      case "LineCreator":
      case "EllipseCreator":
      case "CircleCreator":
        rectCreator.rect.p1 = this.getMousePos(event);
        rectCreator.started = true;
        return;
    }
  }

  mousemove(event: MouseEvent) {
    // let pos = this.getMousePos(event);
    console.log(event);
    switch(this.currentKey) {
      case "PathCreator":
        if (pathCreator.started) {
          pathCreator.toPos = this.getMousePos(event)
          this.invalidate(null);
        }
        return;
      case "RectCreator":
      case "LineCreator":
      case "EllipseCreator":
      case "CircleCreator":
        rectCreator.rect.p2 = this.getMousePos(event);
        this.invalidate(rectCreator.rect);
        return;
    }
  }

  getMousePos(event: MouseEvent) {
    return {
      x: event.offsetX,
      y: event.offsetY
    }
  }

  mouseup(event: MouseEvent) {
    switch(this.currentKey) {
      case "PathCreator": 
        return;
      case "RectCreator":
      case "LineCreator":
      case "EllipseCreator":
      case "CircleCreator": 
        rectCreator.rect.p2 = this.getMousePos(event)
        this.addShape(rectCreator.buildShape() as Shape);
        rectCreator.reset();
    }
  }

  dblclick(event:MouseEvent) {
    event.preventDefault();
    switch(this.currentKey) {
      case "PathCreator":
        if (pathCreator.started) {
          this.addShape(pathCreator.buildShape());
          pathCreator.reset();
        }
        return;
    }
  }

  attachCanvas(canvas: HTMLCanvasElement) {
    console.log(canvas);
    canvas.onmouseup = this.mouseup;
    canvas.onmousedown = this.mousedown;
    canvas.onmousemove = this.mousemove;
    canvas.ondblclick = this.dblclick;

  }
}

const view = new View();
export default view;

class PathCreator {
  fromPos: Point;
  toPos: Point;
  points: Point[] = [];
  started: boolean = false;
  close: boolean = false;

  constructor() {
    this.fromPos = this.toPos = {x:0, y:0};
  }
  reset() {
    this.points = [];
    this.started = false;
  }

  buildShape() {
    // TODO: to be finished
    return new Path(this.points, this.close, view.getLineStyle());
  }
}

class RectCreator {
  rect: RectByPoints = {p1: {x:0, y:0}, p2:{x:0, y:0}};
  started: boolean = false;
  shapeType: String = "line";

  reset() {
    this.started = false;
    view.invalidate(this.rect!)
  }

  buildShape() {
    let rect = this.rect;
    let r = this.normalizeRect(rect!);
    switch(this.shapeType) {
      case "line":
        return new Line(rect.p1, rect.p2, view.getLineStyle());
      case "rect":
        return new Rect(r, view.getLineStyle());
      default:
        alert("unknown shapetype");
        return new Line(rect.p1, rect.p2, view.getLineStyle());
    }

  }

  normalizeRect(rect: RectByPoints) : RectByLength{
    let x = rect.p1.x;
    let y = rect.p1.y;

    let width = rect.p2.x - x;
    let height = rect.p2.y - y;

    if (width < 0) {
      x = rect.p2.x;
      width = - width;
    }

    if (height < 0) {
      y = rect.p2.y;
      height = - height;
    }

    return {x, y, width, height};
  }

} 

const pathCreator = new PathCreator();
const rectCreator = new RectCreator();

class Rect implements Shape {

  x: number;
  y: number;
  width: number;
  height: number;
  lineStyle: LineStyle;

  constructor(rect: RectByLength, lineStyle: LineStyle) {
      this.x = rect.x;
      this.y = rect.y;
      this.width = rect.width;
      this.height = rect.height;
      this.lineStyle = lineStyle;

  }

  onPaint(ctx: CanvasRenderingContext2D) {
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.strokeStyle = lineStyle.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
}

class Path implements Shape {
  points: Point[];
  close: boolean;
  lineStyle: LineStyle;

  constructor(points: Point[], close: boolean, lineStyle: LineStyle) {
    this.points = points;
    this.close = close;
    this.lineStyle = lineStyle;
  }

  onPaint(ctx: CanvasRenderingContext2D) {
    let n = this.points.length;
    if (n < 1) {
      return;
    }

    let points = this.points;
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.strokeStyle = lineStyle.color;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < n; i ++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    if (this.close) {
      ctx.closePath();
    }

    ctx.stroke();
  }

}


