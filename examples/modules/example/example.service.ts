import { Injectable, RequestService } from '@/index'

@Injectable()
export default class ExampleService {
  constructor(private readonly requestService: RequestService) {}
}
