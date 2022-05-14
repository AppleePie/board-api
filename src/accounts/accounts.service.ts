import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterAccountDto } from './dto/register-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { LoginAccountDto } from './dto/login-account.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/role.enum';

@Injectable()
export class AccountsService {
  public constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  public async create({ login, name, password }: RegisterAccountDto) {
    if ((await this.findOneByLogin(login)) != null) return false;

    const hashed = await this.getHash(password);

    await this.accountRepository.insert({
      login,
      name,
      role: Role.User,
      password: hashed,
    });

    return true;
  }

  public findAll() {
    return this.accountRepository.find();
  }

  public findOne(uuid: string) {
    return this.accountRepository.findOne(uuid);
  }

  public findOneByLogin(login: string) {
    return this.accountRepository.findOne({ where: { login } });
  }

  public update(uuid: string, updateAccountDto: UpdateAccountDto) {
    return this.accountRepository.update(uuid, updateAccountDto);
  }

  public updateRole(uuid: string, role: Role) {
    return this.accountRepository.update(uuid, { role });
  }

  public async updateLoginAndPassword({ login, password }: LoginAccountDto) {
    const account = await this.findOneByLogin(login);

    if (!account) return false;

    const hashed = await this.getHash(password);

    await this.update(account.id, { login, password: hashed });

    return true;
  }

  public remove(uuid: string) {
    return this.accountRepository.delete(uuid);
  }

  private async getHash(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
}
