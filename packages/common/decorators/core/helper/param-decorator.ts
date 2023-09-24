import { MetaDataTypes } from '../../../enums'
import { MiddlewareResponseContext } from '../../../interfaces'
import { RequestConfig } from '../../../providers'

export const swtichMetadataTypeRelationValues = (
  Req: RequestConfig,
  metadataType: MetaDataTypes,
  middlewareResponseContext: MiddlewareResponseContext
) => {
  switch (metadataType) {
    case MetaDataTypes.REQUEST:
      return Req
    case MetaDataTypes.RESPONSE:
      return middlewareResponseContext
    case MetaDataTypes.HEADERS:
      return Req.headers
    case MetaDataTypes.BODY:
      return Req.data
    case MetaDataTypes.PARAM:
      return Req.params
    case MetaDataTypes.CUSTOMARGS:
      return Req
    default:
      return Req
  }
}
