import RectCreator from './creator/controller';
import './style.css'
import SView from './view';

document.querySelector<HTMLDivElement>('#menu')!.innerHTML = `
  <input type="button" id="LineCreator" value = "画线" style="visibility:hidden">
  <input type="button" id="RectCreator" value = "画矩形" style="visibility:hidden">
  <input type="button" id="EllipseCreator" value = "画椭圆" style="visibility:hidden">
  <input type="button" id="CircleCreator" value = "画圆" style="visibility:hidden">
  
`

var view = new SView();
view.registerController("LineCreator", new RectCreator(view, "line"));
view.registerController("RectCreator", new RectCreator(view, "rect"));
view.registerController("EllipseCreator", new RectCreator(view, "ellipse"));
view.registerController("CircleCreator", new RectCreator(view, "circle"));

console.log("controllers registered");
for (let key of view.controllers.keys()) {
  console.log(key)
  let ele = document.getElementById(key);
  if (ele != null) {
    ele.style.visibility = "visible";
    ele.onclick = function() {
      if (view._currentKey != "") {
        document.getElementById(view._currentKey)?.removeAttribute("style");
      }

      ele!.style.borderColor = "blue";
      ele?.blur();
      view.invokeController(key);
    }
  }
}
