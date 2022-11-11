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

export function installStyleConfig(view: SView) {
  document.getElementById("menu")?.insertAdjacentHTML("afterend", `<br><div id="properties">
    <label for="LineWidth">线宽: </label>  
    <select id="LineWidth" onchange="onLineWidthChanged()">
      <option value="1">1</option>
      <option value="3">3</option>
      <option value="5">5</option>
      <option value="7">7</option>
      <option value="9">9</option>
    </select>&nbsp;
    <label for="LineColor">颜色: </label>
    <select id="LineColor" onchange="onLineColorChanged()">
      <option value="black">黑色</option>
      <option value="red">红色</option>
      <option value="blue">蓝色</option>
      <option value="green">绿色</option>
      <option value="yellow">黄色</option>
    </select>
    </div>
    `)
  
  const lineWidthSelect = document.getElementById("LineWidth")! as HTMLSelectElement;
  lineWidthSelect.onchange = function() {
    view.properties.lineWidth = Number.parseInt(lineWidthSelect.value);
    
    console.log("Line width changed to " + lineWidthSelect.value)
  }

  const lineColorSelect = document.getElementById("LineColor")! as HTMLSelectElement;
  lineColorSelect.onchange = function() {
    view.properties.lineColor = lineColorSelect.value;
    console.log("Line color changed to " + lineColorSelect.value)
  }

}