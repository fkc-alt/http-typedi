import { Type } from 'class-transformer'
import {
  IsNumber,
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
  IsString,
  IsEnum,
  Validate
} from 'class-validator'
import { Enums } from '~@/typings/enums/roles'
import { ContentLength, IsLongerThan } from './validateDto/content.dto'

export class ArticleListParamDto {
  @IsString()
  @IsNotEmpty({ message: '标题 不能为空' })
  title!: string

  @IsEnum(Enums.ArticleStatus)
  @IsNotEmpty({ message: '状态 不能为空' })
  status!: number

  @IsLongerThan('title')
  text!: string
}

export class CheckDemoListDto implements Service.CheckDemoItem {
  @IsString()
  @IsNotEmpty({ message: '名称 不能为空' })
  name!: string

  @IsNumber()
  @IsNotEmpty({ message: '年龄 不能为空' })
  age!: number
}

export default class ArticleListDto implements Service.ArticleListReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  channel!: string[]

  @IsNumber()
  @IsNotEmpty({ message: 'pageSize 不能为空' })
  pageSize!: number

  @IsNumber()
  @IsNotEmpty({ message: 'currentPage 不能为空' })
  currentPage!: number

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ArticleListParamDto)
  param!: ArticleListParamDto

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckDemoListDto)
  checkDemoList!: CheckDemoListDto[]

  @Validate(ContentLength, [3, 20])
  content!: string
}
