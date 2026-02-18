import { SignInDto, SignInResponseDto } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpDto, SignUpResponseDto } from '@/modules/auth/dtos/sign-up.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { SignInResponseSwagger } from '@/modules/auth/swagger/sign-in.swagger';
import { SignUpResponseSwagger } from '@/modules/auth/swagger/sign-up.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Serialize(SignUpResponseDto)
  @SignUpResponseSwagger()
  signUp(@Body() body: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  @SignInResponseSwagger()
  signIn(@Body() body: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(body);
  }
}
