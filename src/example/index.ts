import { Module, HttpFactory, Injectable } from '../plugins'

@Injectable()
class RequestService {
  age = 20
}

@Module({
  providers: [RequestService]
})
class AppModule {
  constructor(public service: RequestService) {}
}

export const app = HttpFactory.create(AppModule)
