import { Module } from '../../../http-typedi'
import UploadService from '../../common/providers/upload.service'
import UserModule from '../user/user.module'
import UserController from '../user/user.controller'
import OrderController from './order.controller'
import OrderService from './order.service'

const order = {
  provide: 'order',
  useValue: 'order'
}

@Module({
  imports: [UserModule],
  controllers: [OrderController, UserController],
  providers: [OrderService, UploadService, order],
  exports: [OrderService, UploadService, order]
})
export default class OrderModule {}
