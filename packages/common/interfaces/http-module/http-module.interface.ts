import { MiddlewareConsumer } from '../middleware/middleware-consumer.interface'
export interface HttpTypeDIModule {
  configure(consumer: MiddlewareConsumer): any
}
