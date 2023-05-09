import {
  Override,
  Injectable,
  Param,
  ParseIntPipe,
  DefaultValuePipe
} from '../../../http-typedi'

@Injectable()
export default class DemoService {
  @Override()
  public Log(
    @Param(['id', 'price'], new DefaultValuePipe('1000.99'), new ParseIntPipe())
    record: number | Record<string, any>,
    @Param('name', new DefaultValuePipe('落魄前端'))
    name: string | Record<string, any>
  ): void {
    console.log('this is DemoService', record, name, '1')
  }
}
