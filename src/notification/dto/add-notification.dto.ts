import { IsString } from 'class-validator';

export class AddNotificationDto {
  @IsString()
  channel: string;

  @IsString()
  message: string;
}
