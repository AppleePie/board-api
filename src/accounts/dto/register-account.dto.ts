import { IsNotEmpty } from 'class-validator';
import { LoginAccountDto } from './login-account.dto';

export class RegisterAccountDto extends LoginAccountDto {
  @IsNotEmpty()
  public name: string;
}
