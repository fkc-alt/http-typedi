import 'reflect-metadata'
import './style.css'
import { application } from './example/main'
const {
  articleController: { GetTableDataList }
} = application
GetTableDataList({
  currentPage: 1,
  pageSize: 10
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <h1>http-typedi</h1>
  </div>
`
