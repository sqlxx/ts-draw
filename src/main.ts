import './style.css'
import './drawing'
import view from './drawing'

document.querySelector<HTMLDivElement>('#canvas')!.innerHTML = `
  <canvas id="drawing" width="1024" height="661">您的浏览器不支持Canvas</canvas>
`

document.querySelector<HTMLDivElement>('#menu')!.innerHTML = `
  <select name="shapes" id="shapes">
    <option value="path">Path</option>
    <option value="line">Line</option>
    <option value="rect">Rect</option>
    <option value="circle">Circle</option>
    <option value="ellipse">Ellipse</option>
  </select>
`

view.attachCanvas(document.querySelector('#drawing') as HTMLCanvasElement);
view.attachMenu(document.querySelector("#menu") as HTMLDivElement);