import { Module } from '../http-typedi'
import CommonModule from './common/common.module'
import RequestService from './common/providers/request.service'

@Module({
  imports: [CommonModule],
  providers: []
})
export default class AppModule {
  constructor(readonly requestService: RequestService) {}
}
