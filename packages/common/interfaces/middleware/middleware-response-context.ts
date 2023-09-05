import { ExecutionContext } from '../../../common/decorators'

export interface MiddlewareResponseContext extends ExecutionContext {
  query: Record<string, any>
  body: Record<string, any>
  params: Record<string, any>
}
