import { PartialType } from '@nestjs/mapped-types';
import { RegisterAccountDto } from './register-account.dto';

export class UpdateAccountDto extends PartialType(RegisterAccountDto) {}
