import { Module } from 'http-typedi'
import UserController from './user.controller'
import UserService from './user.service'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserController]
})
export default class UserModule {}
