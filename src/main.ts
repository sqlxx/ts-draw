import './style.css'
import './drawing'
import view from './drawing'

document.querySelector<HTMLDivElement>('#canvas')!.innerHTML = `
  <canvas id="drawing" width="1024" height="661">您的浏览器不支持Canvas</canvas>
`

view.attachCanvas(document.querySelector('#drawing') as HTMLCanvasElement);