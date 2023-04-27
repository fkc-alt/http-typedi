import { Injectable } from '../../../http-typedi'

export enum ContentType {
  FORM_URLENCODED,
  FORM_DATA,
  JSON
}

@Injectable()
export default class ContentTypeService {
  static readonly FORM_URLENCODED: string = 'application/x-www-form-urlencoded'
  static readonly FORM_DATA: string = 'multipart/form-data'
  static readonly JSON: string = 'application/json'

  private readonly _contentTypes: Readonly<Record<ContentType, string>> = {
    [ContentType.FORM_URLENCODED]: ContentTypeService.FORM_URLENCODED,
    [ContentType.FORM_DATA]: ContentTypeService.FORM_DATA,
    [ContentType.JSON]: ContentTypeService.JSON
  }

  /**
   * @param {ContentType} ContentType
   * @return {Record<'Content-Type', string>}
   * @memberof ContentTypeService
   * @description 0 application/x-www-form-urlencoded
   * @description 1 multipart/form-data
   * @description 2 application/json
   */
  GetContentType(key: ContentType) {
    return { 'Content-Type': this._contentTypes[key] }
  }
}
