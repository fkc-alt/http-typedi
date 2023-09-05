export interface NextFunction {
  (err?: any): void
  /**
   * "Break-out" of a router by calling {next('router')};
   */
  (deferToNext: 'router'): void
  /**
   * "Break-out" of a route by calling {next('route')};
   */
  (deferToNext: 'route'): void
}
