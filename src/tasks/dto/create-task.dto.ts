import { IsString, IsObject, IsOptional, IsISO8601 } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  type: string;

  @IsObject()
  payload: Record<string, any>;

  @IsOptional()
  @IsISO8601()
  visibility_time?: string;

}
