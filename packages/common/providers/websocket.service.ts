import { Injectable } from '../decorators'

@Injectable()
export class WebsocketService extends WebSocket implements WebSocket {
  constructor(
    WebsocketProps: Pick<
      WebSocket,
      'onclose' | 'onerror' | 'onmessage' | 'onopen' | 'url' | 'protocol'
    >
  ) {
    const { url, protocol, ..._prototype } = WebsocketProps
    super(url, protocol)
    this.onclose = _prototype?.onclose ?? null
    this.onerror = _prototype?.onerror ?? null
    this.onmessage = _prototype?.onmessage ?? null
    this.onopen = _prototype?.onopen ?? null
  }
}

@Injectable()
export class IwebSocket {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(websocketService: WebsocketService) {}
  onclose = function (this: any, ev: any) {
    console.log(ev)
  }
  onerror = function (this: any, ev: any) {
    console.log(ev)
  }
  onmessage = function (this: any, ev: any) {
    console.log(ev)
  }
  onopen = function (this: any, ev: any) {
    console.log(ev)
  }
}
