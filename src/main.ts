import PathCreator from './controller/path_creator';
import RectCreator from './controller/rect_creator';
import { installController, installMousePos } from './menu';
import SView from './view';

var view = new SView();
view.registerController("LineCreator", new RectCreator(view, "line"));
view.registerController("RectCreator", new RectCreator(view, "rect"));
view.registerController("EllipseCreator", new RectCreator(view, "ellipse"));
view.registerController("CircleCreator", new RectCreator(view, "circle"));
view.registerController("PathCreator", new PathCreator(view));

console.log("controllers registered");
installController(view);
installMousePos(view);
