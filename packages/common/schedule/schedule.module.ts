import { Global, Module } from '../decorators'
import { Logger } from '../providers'
import { ScheduleExplorer } from './schedule.explorer'
import { SchedulerOrchestrator } from './scheduler.orchestrator'

@Global()
@Module({
  providers: [ScheduleExplorer, SchedulerOrchestrator]
})
export class ScheduleModule {
  constructor(private readonly logger: Logger) {}
  forRoot() {
    console.log(this.logger, 'ScheduleModule')
  }
}
