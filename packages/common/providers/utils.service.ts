import * as XLSX from 'xlsx'
import { Injectable } from '../core'

interface PrintOpts {
  el: string
  stylesheet?: string
  landscape?: boolean
  noPrintSelector?: '.no-print' | string
  append?: string
  prepend?: string
  hidden?: boolean
}

/**
 *
 * @export {DOMPrint jsonToExcel excelToJson getSearchParams omit pick}
 * @class UtilsService
 * @description 这是帮助类，包含很多常用功能
 */
@Injectable()
export class UtilsService {
  static printDefaultOpts = {
    el: '',
    stylesheet: '',
    landscape: false,
    noPrintSelector: '.no-print',
    append: '',
    prepend: '',
    hidden: false
  }

  /**
   *
   * @static
   * @param {PrintOpts} options
   * @memberof UtilsService
   * @description 打印指定DOM
   */
  static DOMPrint(options: PrintOpts): void {
    options = Object.assign(UtilsService.printDefaultOpts, options)
    if (!options.el) {
      console.warn('Please pass in the DOM ID')
      return
    }
    // 获取打印区域的dom
    const el = document.getElementById(options.el)
    // 创建iframe
    const iframe: any = document.createElement('IFRAME')
    iframe.id = 'print-iframe'
    iframe.style = 'display:none;width:100%;'
    document.body.appendChild(iframe)
    let styleStr = `
      <style media="print">
        @page {
            size: ${options.landscape ? 'landscape' : 'portrait'};
            ${options.hidden ? '' : 'margin:5mm'};
        }
        ${options.noPrintSelector} {
            display:none;
        }
      </style>
    `
    // 获取style样式
    const styles = document.querySelectorAll('style, link')
    styles.forEach(el => (styleStr += el.outerHTML))
    // 写入iframe
    const doc = (<any>iframe).contentWindow.document
    if (options.stylesheet)
      doc.write(`<link rel="stylesheet" href="${options.stylesheet}" />`)
    doc.write(`
      <html>
        <head>
          ${styleStr}
        </head>
        <body>
          ${options.prepend}
          <div>${el!.innerHTML}</div>
          ${options.append}
        </body>
      </html>
    `)
    doc.close()
    iframe.contentWindow.focus()
    iframe.contentWindow.print()
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 0)
  }

  public DOMPrint = UtilsService.DOMPrint

  /**
   *
   * @static
   * @param {string} fileName
   * @param {unknown[]} data
   * @param {string[]} [header]
   * @memberof UtilsService
   * @description JSON转为Excel
   */
  static jsonToExcel(
    fileName: string,
    data: unknown[],
    header?: string[]
  ): void {
    const sheet = XLSX.utils.json_to_sheet(data, { header })
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, fileName)

    XLSX.writeFile(book, `${fileName}`)
  }

  public jsonToExcel = UtilsService.jsonToExcel

  /**
   *
   * @static
   * @template T
   * @param {File} data
   * @param {string[]} keys
   * @return {*}  {Promise<T[]>}
   * @memberof UtilsService
   * @description Excel转为JSON
   */
  static excelToJson<T>(data: File, keys: string[]): Promise<T[]> {
    return new Promise(resolve => {
      const render = new FileReader()
      render.onload = e => {
        const wb = XLSX.read(e.target?.result, {
          // 以字符编码的方式解析
          type: 'binary'
        })
        // 生成json表格内容并进行处理
        try {
          const wbData: T[] = XLSX.utils.sheet_to_json(
            wb.Sheets[wb.SheetNames[0]]
          )
          resolve(
            <any>wbData.map((item: any) =>
              keys.reduce((pre: Record<string, any>, cur, index) => {
                return { ...pre, [cur]: item[Object.keys(item)[index]] || '' }
              }, {})
            )
          )
        } catch (error) {
          console.log(`excel to json error: ${error}`)
          resolve([])
        }
      }
      render.readAsArrayBuffer(data)
    })
  }

  public excelToJson = UtilsService.excelToJson

  /**
   *
   * @static
   * @memberof UtilsService
   */
  static getSearchParams = <T = Record<string, any>>(): T => {
    const searchPar = new URLSearchParams(window.location.search)
    const paramsObj = <any>{}
    for (const [key, value] of searchPar.entries()) {
      paramsObj[key] = value
    }
    return <T>paramsObj
  }

  public getSearchParams = UtilsService.getSearchParams

  private static omitOrPick(
    object: Record<string | symbol | any, any>,
    props: string[] = [],
    type: 'omit' | 'pick'
  ): string[] {
    return Object.keys(object).filter(key =>
      type === 'omit' ? !props.includes(key) : props.includes(key)
    )
  }

  /**
   *
   * @static
   * @template T
   * @param {(Record<string | symbol | any, any>)} object
   * @param {string[]} [props=[]]
   * @return {*}  {T}
   * @memberof UtilsService
   */
  static omit<T>(
    object: Record<string | symbol | any, any>,
    props: string[] = []
  ): T {
    return <T>(
      this.omitOrPick(object, props, 'omit').reduce(
        (_, key) => ({ ..._, [key]: object[key] }),
        {}
      )
    )
  }

  public omit = UtilsService.omit

  /**
   *
   * @static
   * @template T
   * @param {(Record<string | symbol | any, any>)} object
   * @param {string[]} [props=[]]
   * @return {*}  {T}
   * @memberof UtilsService
   */
  static pick<T>(
    object: Record<string | symbol | any, any>,
    props: string[] = []
  ): T {
    return <T>(
      this.omitOrPick(object, props, 'pick').reduce(
        (_, key) => ({ ..._, [key]: object[key] }),
        {}
      )
    )
  }

  public pick = UtilsService.pick
}
