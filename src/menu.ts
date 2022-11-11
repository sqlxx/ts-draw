import SView from "./view";

document.querySelector<HTMLDivElement>('#menu')!.innerHTML = `
  <input type="button" id="LineCreator" value = "画线" style="visibility:hidden">
  <input type="button" id="RectCreator" value = "画矩形" style="visibility:hidden">
  <input type="button" id="EllipseCreator" value = "画椭圆" style="visibility:hidden">
  <input type="button" id="CircleCreator" value = "画圆" style="visibility:hidden">
  <input type="button" id="PathCreator" value = "画路径" style="visibility:hidden">
  
`

export function installController(view: SView) {
    for (let key of view.controllers.keys()) {
        let ele = document.getElementById(key);
        if (ele != null) {
          ele.style.visibility = "visible";
          ele.onclick = function() {
            if (view._currentKey != "") {
              document.getElementById(view._currentKey)?.removeAttribute("style");
            }
            console.log("In onclick for " + key);
      
            ele!.style.borderColor = "blue";
            ele!.blur();
            view.invokeController(key);
          }
        }
      }
}

export function installMousePos(view: SView) {
    document.getElementById("menu")?.insertAdjacentHTML("afterend", '<span id="mousepos">MousePos: N/A</span>')

    let old = view.drawing.onmousemove

    let mousepos = document.getElementById("mousepos");
    view.drawing.onmousemove = function(event) {
        let pos = view.getMousePos(event);
        mousepos!.innerText= "MosePos: " + pos.x + ", " + pos.y;
        old!.call(this, event)
    }
}