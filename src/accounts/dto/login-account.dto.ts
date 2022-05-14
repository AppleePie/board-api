import { IsNotEmpty, Length } from 'class-validator';

export class LoginAccountDto {
  @IsNotEmpty()
  @Length(5, 30, {
    message: 'username length should be between 5 and 30 characters',
  })
  public login: string;

  @IsNotEmpty()
  @Length(5, 30, {
    message: 'username length should be between 5 and 30 characters',
  })
  public password: string;
}
