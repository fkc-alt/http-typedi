import { Injectable } from 'http-typedi'

@Injectable()
export default class OrderService {
  public Log(): void {
    console.log('this is OrderService')
  }
}
