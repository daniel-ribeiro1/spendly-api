import {
  SignUpDto,
  SignUpResponse,
  SignUpResponseSwagger,
} from '@/modules/auth/dtos/sign-up.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(SignUpResponse)
  @ApiCreatedResponse({
    type: SignUpResponseSwagger,
    description: 'Usuário cadastrado com sucesso!',
  })
  @Post('sign-up')
  signUp(@Body() body: SignUpDto): Promise<SignUpResponse> {
    return this.authService.signUp(body);
  }
}
