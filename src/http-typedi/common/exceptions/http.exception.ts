import { isObject, isString } from '../helper'

export interface HttpExceptionOptions {
  cause?: Error
  description?: string
}

export interface DescriptionAndOptions {
  description?: string
  httpExceptionOptions?: HttpExceptionOptions
}

export class HttpException extends Error {
  public override cause!: Error | undefined
  public override message!: string
  constructor(
    private readonly response: string | Record<string, any>,
    private readonly status: number,
    private readonly options?: HttpExceptionOptions
  ) {
    super()
    this.initMessage()
    this.initName()
    this.initCause()
  }

  /**
   * Configures error chaining support
   *
   * See:
   * - https://nodejs.org/en/blog/release/v16.9.0/#error-cause
   * - https://github.com/microsoft/TypeScript/issues/45167
   */
  public initCause(): void {
    if (this.options?.cause) {
      this.cause = this.options.cause
      return
    }

    if (this.response instanceof Error) {
      //   Logger.warn(
      //     'DEPRECATED! Passing the error cause as the first argument to HttpException constructor is deprecated. You should use the "options" parameter instead: new HttpException("message", 400, { cause: new Error("Some Error") }) '
      //   )
      this.cause = this.response
    }
  }

  public initMessage() {
    if (isString(this.response)) {
      this.message = <string>this.response
    } else if (
      isObject(this.response) &&
      isString((this.response as Record<string, any>).message)
    ) {
      this.message = (this.response as Record<string, any>).message
    } else if (this.constructor) {
      this.message =
        <string>(
          (<unknown>this.constructor?.name?.match?.(/[A-Z][a-z]+|[0-9]+/g))
        ) ?? [].join(' ')
    }
  }

  public initName(): void {
    this.name = this.constructor.name
  }

  public static createBody(
    objectOrErrorMessage: object | string,
    description?: string,
    statusCode?: number
  ) {
    if (!objectOrErrorMessage) {
      return { statusCode, message: description }
    }
    return isObject(objectOrErrorMessage) &&
      !Array.isArray(objectOrErrorMessage)
      ? objectOrErrorMessage
      : { statusCode, message: objectOrErrorMessage, error: description }
  }

  public static extractDescriptionAndOptionsFrom(
    descriptionOrOptions: string | HttpExceptionOptions
  ): DescriptionAndOptions {
    const description = isString(descriptionOrOptions)
      ? descriptionOrOptions
      : (<HttpExceptionOptions>descriptionOrOptions)?.description

    const httpExceptionOptions = isString(descriptionOrOptions)
      ? {}
      : descriptionOrOptions

    return <DescriptionAndOptions>{
      description,
      httpExceptionOptions
    }
  }
}
