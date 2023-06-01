import { Injectable } from '@/index'

@Injectable()
export default class UserService {
  public Log(): void {
    console.log('this is UserService')
  }
}
