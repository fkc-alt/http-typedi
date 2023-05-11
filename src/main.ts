import 'reflect-metadata'
import './style.css'
import { application } from './example/main'
var a = 'test'
const {
  articleController: { GetTableDataList, GetArticleList }
} = application
GetTableDataList({
  currentPage: 1,
  pageSize: 10
})
GetArticleList({
  currentPage: 1,
  pageSize: 10,
  channel: ['1', '2'],
  checkDemoList: [
    {
      age: 1,
      name: '11111'
    }
  ],
  content: '123123',
  param: {
    status: 1,
    text: '123121111111',
    title: '11231223'
  }
})

console.log(application)
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <h1>http-typedi</h1>
  </div>
`
