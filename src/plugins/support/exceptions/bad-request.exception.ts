import { HttpStatus } from '../interface/enums'
import { HttpExceptionOptions, HttpException } from './http.exception'

export class BadRequestException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions: string | HttpExceptionOptions = 'Bad Request'
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions)

    super(
      HttpException.createBody(
        objectOrError,
        description,
        HttpStatus.BAD_REQUEST
      ),
      HttpStatus.BAD_REQUEST,
      httpExceptionOptions
    )
  }
}
