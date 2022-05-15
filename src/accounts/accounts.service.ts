import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterAccountDto } from './dto/register-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { LoginAccountDto } from './dto/login-account.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/roles/role.enum';

@Injectable()
export class AccountsService {
  public constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  public async create({
    login,
    name,
    password,
  }: RegisterAccountDto): Promise<string> {
    if ((await this.findOneByLogin(login)) != null) return null;

    const hashed = await this.getHash(password);

    const result = await this.accountRepository.insert({
      login,
      name,
      role: Role.User,
      password: hashed,
    });

    const [created] = result.identifiers;

    return created.id;
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

  public async update(
    uuid: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<string> {
    await this.accountRepository.update(uuid, updateAccountDto);
    return uuid;
  }

  public async updateRole(uuid: string, role: Role) {
    console.log(uuid, role);

    await this.accountRepository.update(uuid, { role });

    return uuid;
  }

  public async updateLoginAndPassword({ login, password }: LoginAccountDto) {
    const account = await this.findOneByLogin(login);

    if (!account) return null;

    const hashed = await this.getHash(password);

    return this.update(account.id, { login, password: hashed });
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
