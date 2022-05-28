import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  HttpStatus,
  Req,
  ForbiddenException,
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../auth/roles/role.enum';
import { AccountsService } from './accounts.service';
import { RegisterAccountDto } from './dto/register-account.dto';
import { GetAccountDto } from './dto/get-account.dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from '../auth/types';
import { LoggerService } from '../logger/logger.service';
import { Auth } from '../auth/auth.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
  public constructor(
    private readonly accountsService: AccountsService,
    private readonly authService: AuthService,
    @Inject(LoggerService.diKey) private readonly logger: LoggerService,
  ) {}

  @Get(':id')
  public async getPublicUserData(@Param('id') id: string) {
    const account = (await this.accountsService.findOne(id)) ?? new Account();
    return GetAccountDto.from(account);
  }

  @Post('registration')
  public async registerAccount(@Body() registerAccountDto: RegisterAccountDto) {
    const createdAccountId = await this.accountsService.create(
      registerAccountDto,
    );

    if (!createdAccountId) {
      throw new BadRequestException('Account exist');
    }

    this.logger.info(`Created account with id = ${createdAccountId}`);

    return await this.login(registerAccountDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginAccountDto: LoginAccountDto) {
    const payload = await this.authService.login(loginAccountDto);

    if (!payload) {
      throw new UnauthorizedException();
    }

    this.logger.info(`Successful login in ${loginAccountDto.login}`);

    return payload;
  }

  @Put(':id/role')
  @Auth(Role.Administrator)
  public async updateRole(
    @Param('id') id: string,
    @Body() { role }: UpdateRoleDto,
  ) {
    const updatedId = await this.accountsService.updateRole(id, role);

    this.logger.info(`Updated role of account with id = ${updatedId}`);
  }

  @Put('update')
  @Auth()
  public async updateLoginAndPassword(
    @Req() { user }: Request,
    @Body() loginAccountDto: LoginAccountDto,
  ) {
    if (
      user.login !== loginAccountDto.login &&
      user.role !== Role.Administrator
    ) {
      throw new ForbiddenException();
    }

    const updatedId = await this.accountsService.updateLoginAndPassword(
      loginAccountDto,
    );

    this.logger.info(
      `Updated login and password of account with id = ${updatedId}`,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth(Role.Administrator)
  public async deleteAccount(@Param('id') id: string) {
    await this.accountsService.remove(id);
  }
}
