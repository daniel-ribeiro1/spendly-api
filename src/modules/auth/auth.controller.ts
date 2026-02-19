import { SignInBody, SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody, SignUpResponse } from '@/modules/auth/dtos/sign-up.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { SignInResponseSwagger } from '@/modules/auth/swagger/sign-in.swagger';
import { SignUpResponseSwagger } from '@/modules/auth/swagger/sign-up.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Serialize(SignUpResponse)
  @SignUpResponseSwagger()
  signUp(@Body() body: SignUpBody): Promise<SignUpResponse> {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  @SignInResponseSwagger()
  signIn(@Body() body: SignInBody): Promise<SignInResponse> {
    return this.authService.signIn(body);
  }
}
