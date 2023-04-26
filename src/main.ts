import 'reflect-metadata'
import './style.css'
import { app } from './example'

console.log(app.service)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <h1>http-typedi</h1>
  </div>
`
