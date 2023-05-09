import { Global, Module } from '../../../http-typedi'
import OrderModule from '../order/order.module'
import OrderController from '../order/order.controller'
import ArticleController from './article.controller'
import ArticleService from './article.service'
import HelperController from './helper.controller'
import HelplerService from './providers/helper.service'

@Global()
@Module({
  imports: [OrderModule],
  controllers: [ArticleController, OrderController, HelperController],
  providers: [ArticleService, HelplerService]
})
export default class ArticleModule {}
