import { Injectable } from '@/index'
import RequestService from '../../common/providers/request.service'

@Injectable()
export default class ExamplesService {
  constructor(private readonly requestService: RequestService) {}
}
