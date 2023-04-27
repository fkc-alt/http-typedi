declare namespace Service {
  interface ArticleItem {
    id: string | number
    description: string
    title: string
    content: string
    status: number
  }
  interface ArticleListRes {
    articleList: ArticleItem[]
  }
  interface CheckDemoItem {
    name: string
    age: number
  }
  interface ArticleListReq extends Services.Common.Pagination {
    channel: string[]
    param: {
      title: string
      status: number
      text: string
    }
    checkDemoList: CheckDemoItem[]
    content: string
  }
}
