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
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '../roles/role.enum';
import { Roles as WithRole } from '../roles/roles.decorator';
import { AccountsService } from './accounts.service';
import { RegisterAccountDto } from './dto/register-account.dto';
import { GetAccountDto } from './dto/get-account.dto';
import { JwtAuthGuard } from '../auth/jwt.auth';
import { LoginAccountDto } from './dto/login-account.dto';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/types';

type Request = { user: User };

@Controller('accounts')
export class AccountsController {
  public constructor(
    private readonly accountsService: AccountsService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  public async getPublicUserData(@Param('id') id: string) {
    const account = await this.accountsService.findOne(id);
    return GetAccountDto.from(account);
  }

  @Post('registration')
  public async registerAccount(@Body() registerAccountDto: RegisterAccountDto) {
    const isCreated = await this.accountsService.create(registerAccountDto);

    if (!isCreated) throw new BadRequestException('Account exist');
  }

  @Post('login')
  public async login(@Body() loginAccountDto: LoginAccountDto) {
    return this.authService.login(loginAccountDto);
  }

  @Put(':id/role')
  @UseGuards(JwtAuthGuard)
  @WithRole(Role.Administrator)
  public async updateRole(@Param('id') id: string, @Body() role: Role) {
    await this.accountsService.updateRole(id, role);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
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

    await this.accountsService.updateLoginAndPassword(loginAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @WithRole(Role.Administrator)
  public async deleteAccount(@Param('id') id: string) {
    await this.accountsService.remove(id);
  }
}
