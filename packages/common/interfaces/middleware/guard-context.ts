import { ExecutionContext } from '../../decorators'

export interface GuardContext extends ExecutionContext {
  query: Record<string, any>
  body: Record<string, any>
  params: Record<string, any>
}
