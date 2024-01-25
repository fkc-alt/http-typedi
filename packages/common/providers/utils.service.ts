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
 * @export
 * @class UtilsService
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
   */
  static jsonToExcel(fileName: string, data: unknown[], header?: string[]) {
    const sheet = XLSX.utils.json_to_sheet(data, { header })
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, fileName)

    XLSX.writeFile(book, `${fileName}.xlsx`)
  }

  public jsonToExcel = UtilsService.jsonToExcel
}
