import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { LoginRequest } from 'src/app/auth/dto/login.request';
import { AuthService } from 'src/app/auth/auth.service';
import { Tokens } from 'src/core/hash/dto/tokens';
import { SignUpRequest } from 'src/app/auth/dto/sign-up.request';
import { EmailConfirmResendRequest } from 'src/app/auth/dto/email-confirm-resend.request';
import { Unprocessable } from 'src/core/exception/unprocessable';
import { UserStatus } from 'src/app/user/enum/user.status';
import { AuthUser } from 'src/core/decorator/auth.user.decorator';
import { User } from '@prisma/client';
import { RefreshBearerGuard } from 'src/app/auth/guard/refresh-bearer.guard';
import { Public } from 'src/app/auth/guard/auth-bearer.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() auth: SignUpRequest, @Res() res: FastifyReply) {
    const user = await this.authService.signup(auth);
    const token = await this.authService.confirmToken(user);
    await this.authService.sendConfirmationEmail(user, token);
    return res.status(HttpStatus.CREATED).send();
  }

  @Public()
  @Post('login')
  async login(@Body() auth: LoginRequest, @Res() res: FastifyReply) {
    const tokens: Tokens = await this.authService.login(auth);
    return res.status(HttpStatus.OK).send({ data: tokens });
  }

  @Post('logout')
  async logout(@AuthUser() user: User, @Res() res: FastifyReply) {
    await this.authService.logout(user);
    return res.status(HttpStatus.OK).send();
  }

  @Post('refresh')
  @UseGuards(RefreshBearerGuard)
  async refresh(@AuthUser() user: User, @Res() res: FastifyReply) {
    const tokens: Tokens = await this.authService.refresh(user);
    res.status(HttpStatus.OK).send({ data: tokens });
  }

  @Public()
  @Get('confirm-email/:token')
  async confirmEmail(@Param('token') token: string, @Res() res: FastifyReply) {
    await this.authService.confirmUser(token);
    return res.status(HttpStatus.OK).send();
  }

  @Public()
  @Post('confirm-email-resend')
  async confirmEmailResend(
    @Body() email: EmailConfirmResendRequest,
    @Res() res: FastifyReply,
  ) {
    const user = await this.authService.findUserByLogin(email.email);
    if (!user) {
      throw new Unprocessable(500004, 'Wrong user arguments');
    }
    if (user.status !== UserStatus.PENDING && user.confirmAt !== null) {
      throw new Unprocessable(500006, 'Wrong user arguments');
    }
    const token = await this.authService.confirmToken(user);
    await this.authService.sendConfirmationEmail(user, token);
    return res.status(HttpStatus.CREATED).send();
  }
}
