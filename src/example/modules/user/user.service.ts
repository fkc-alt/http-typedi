import { Injectable } from '../../../http-typedi'

@Injectable()
export default class UserService {
  public Log(): void {
    console.log('this is UserService')
  }
}
