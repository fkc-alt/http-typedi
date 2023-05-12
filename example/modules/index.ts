export enum Route {
  ARTICLE = 'article',
  ORDER = 'order',
  USER = 'user'
}

export enum ArticleRouteChildren {
  GETARTICLELIST = 'getArticleList',
  TABLEDATA = 'tableData'
}

export enum OrderRouteChildren {
  ORDERDETAIL = 'orderDetail',
  ORDERLIST = 'orderList',
  UPLOADFILE = 'uploadFile',
  UPLOADBASE64 = 'uploadBase64'
}

export enum UserRouteChildren {
  LOGIN = 'login',
  INFO = 'info/:id/:phone'
}
