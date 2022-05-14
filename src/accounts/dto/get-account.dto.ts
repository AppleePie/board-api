import { Account } from '../entities/account.entity';

export class GetAccountDto {
  public id: string;
  public name: string;

  public static from({ id, name }: Account) {
    const accountDto = new GetAccountDto();

    accountDto.id = id;
    accountDto.name = name;

    return accountDto;
  }
}
