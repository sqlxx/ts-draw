import './style.css'
import './drawing'

document.querySelector<HTMLDivElement>('#canvas')!.innerHTML = `
  <canvas id="drawing" width="1024" height="661" onmousedown="view.mousedown(event)">您的浏览器不支持Canvas</canvas>
`