import { Module, HttpFactory, Injectable } from '../plugins'

@Injectable()
class RequestService {
  url = 'http://localhost:8080'
}

@Module({
  providers: [RequestService]
})
class AppModule {
  constructor(public service: RequestService) {}
}

export const app = HttpFactory.create(AppModule)
