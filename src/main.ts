import 'reflect-metadata'
import './style.css'
import { application } from './example/main'

console.log(application.requestService)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <h1>http-typedi</h1>
  </div>
`
