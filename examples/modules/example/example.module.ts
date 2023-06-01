import { Global, Module } from '@/index'
import ExampleController from './example.controller'
import ExampleService from './example.service'
import ExamplesService from './examples.service'

@Global()
@Module({
  controllers: [ExampleController],
  providers: [ExampleService, ExamplesService]
})
export default class ExampleModule {}
