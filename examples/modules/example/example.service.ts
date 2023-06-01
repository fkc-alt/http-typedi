import { Injectable } from '@/index'
import RequestService from '../../common/providers/request.service'

@Injectable()
export default class ExampleService {
  constructor(private readonly requestService: RequestService) {}
}
