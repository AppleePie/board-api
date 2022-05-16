import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';
import { LoginAccountDto } from 'src/accounts/dto/login-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  public constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  public async login({ login, password }: LoginAccountDto) {
    const account = await this.accountsService.findOneByLogin(login);
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return null;
    }

    const payload = {
      login: account.login,
      username: account.name,
      role: account.role,
    };

    return {
      ...payload,
      expiredAt: new Date(new Date().getTime() + 15 * 60000),
      accessToken: this.jwtService.sign(payload),
    };
  }
}
