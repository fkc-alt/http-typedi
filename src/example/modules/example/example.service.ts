import RequestService from '../../common/providers/request.service'
import { Injectable } from '../../../http-typedi'

@Injectable()
export default class ExampleService {
  constructor(private readonly requestService: RequestService) {}
}
