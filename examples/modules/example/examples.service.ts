import { Injectable, RequestService } from '@/index'

@Injectable()
export default class ExamplesService {
  constructor(private readonly requestService: RequestService) {}
}
