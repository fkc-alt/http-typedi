import { Global, Module } from '../../../http-typedi'
import DemoController from './demo.controller'
import DemoService from './demo.service'

@Global()
@Module({
  controllers: [DemoController],
  providers: [DemoService]
})
export default class DemoModule {}
