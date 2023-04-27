import { IsNotEmpty, IsNumber } from 'class-validator'

export default class TableDataDto implements Service.TableDataReq {
  @IsNumber()
  @IsNotEmpty({ message: 'pageSize 不能为空' })
  pageSize!: number

  @IsNumber()
  @IsNotEmpty({ message: 'currentPage 不能为空' })
  currentPage!: number
}
