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
  onPaint(ctx: CanvasRenderingContext2D)
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

    if (close) {
      ctx.closePath();
    }

    ctx.stroke();
  }

}

class View {
  properties: { };
  shapes: Shape[];
  currentKey: string = "line";
  drawing: HTMLCanvas

  constructor() {
    this.darwing = document.getElementById("drawing");
    this.currentKey = "";

    this.properties = {
      lineWidth: 1,
      lineColor: "black"
    };
  }

  getLineStyle() {
    return new LineStyle(properties.lineWidth, properties.lineColor);
  }

  addShape(shape: Shape) {
    if (shape != null) {
      shapes.push(shape);
    }
  }

  invalidate(reserved) {
    let ctx = drawing.getContext("2d");
    let bound = drawing.getBoundingClientRect();

    ctx.clearRect(0, 0, bound.width, bound.height);

    onPaint(ctx);
  }

  onPaint(ctx: CanvasRenderingContext2D) {
    let shapes = view.shapes;

    for (let i in shapes) {
      shapes[i].onpaint(ctx);
    }

    switch(view.currentKey) {
      case "PathCreator":
        if (pathCreator.started) {
          let props = properties;
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
          rectCreator.buildShape().onpaint(ctx);
        }
    }
  }

  mousedown(event) {

    switch(this.currentKey) {
      case "PathCreator":
        pathCreator.toPos = getMousePos(event)
        if (pathCreator.started) {
          pathCreator.points.push(pathCreator.toPos);
        } else {
          pathCreator.fromPos = pathCreator.toPos;
          pathCreator.started = true;
        }
        invalidate();
        return;
      case "RectCreator":
      case "LineCreator":
      case "EllipseCreator":
      case "CircleCreator":
        rectCreator.rect.p1 = getMousePos(event);
        rectCreator.started = true;
        return;
    }
  }

  mousemove(event) {
    let pos = getMousePos(event);
    switch(currentKey) {
      case "PathCreator":
        if (pathCreator.started) {
          pathCreator.toPos = getMousePos(event)
          invalidate();
        }
        return;
      case "RectCreator":
      case "LineCreator":
      case "EllipseCreator":
      case "CircleCreator":
        rectCreator.rect.p2 = getMousePos(event);
        invalidate(rectCreator.rect);
        return;
    }
  }

  mouseup(event) {
    switch(currentKey) {
      case "PathCreator": 
        return;
      case "RectCreator":
      case "LineCreator":
      case "EllipseCreator":
      case "CircleCreator": 
        rectCreator.rect.p2 = getMousePos(event)
        addShape(rectCreator.buidShape());
        rectCreator.reset();
    }
  }

  dblclick(event) {
    event.preventDefault();
    switch(currentKey) {
      case "PathCreator":
        if (pathCreator.started) {
          qview.addShape(pathCreator.buildShape());
          pathCreator.reset();
        }
        return;
    }
  }
}

export default view = new View();
const pathCreator = new PathCreator();
const rectCreator = new RectCreator();

class PathCreator {
  points: Point[];
  started: boolean = false;

  reset() {
    points = [];
    started = fasle;
  }

  buildShape() {
    // TODO: to be finished
    return new Path(points, getLineStyle());
  }
}

class RectCreator {
  rect: RectByPoints;
  started: boolean;
  shapeType: String = "line";

  reset() {
    this.started = false;
    invalidate(this.rect)
  }

  buildShape() {
    let rect = this.rect;
    let r = normalizeRect(rect);
    switch(this.shapeType) {
      case "line":
        return new Line(rect.p1, rect.p2, getLineStyle());
      case "rect":
        return new Rect(r, getLineStyle());
      default:
        alert("unknown shapetype");
    }

  }

  normalizeRect(rect: RectByPoints) {
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

    return new RectByLength(x, y, width, length);
  }

} 


