import { Injectable } from '@/index'

@Injectable()
export default class OrderService {
  public Log(): void {
    console.log('this is OrderService')
  }
}
