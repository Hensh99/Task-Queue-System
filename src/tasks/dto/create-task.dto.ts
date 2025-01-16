import { IsString, IsObject, IsOptional, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsObject()
  payload: Object

  @IsOptional()
  @IsISO8601()
  visibility_time?: string;

}
