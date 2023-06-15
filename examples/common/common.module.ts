import { Global, Module, RequestService, UploadService } from '@/index'

@Global()
@Module({
  providers: [
    RequestService,
    UploadService,
    {
      provide: 'CONFIG',
      useFactory: () => ({
        url: 'http://localhost:3000',
        host: 'localhost',
        log: false
      })
    },
    {
      provide: 'STRING',
      useValue: 'a,b,c'
    }
  ]
})
export default class CommonModule {}
