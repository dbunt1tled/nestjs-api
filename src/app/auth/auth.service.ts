import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/user.service';
import { HashService } from 'src/core/hash/hash.service';
import { Tokens } from 'src/core/hash/dto/tokens';
import { LoginRequest } from 'src/app/auth/dto/login.request';
import { Unauthorized } from 'src/core/exception/unauthorized';
import { UserStatus } from 'src/app/user/enum/user.status';
import { Roles } from 'src/app/role/enum/roles';
import { SignUpRequest } from 'src/app/auth/dto/sign-up.request';
import { User } from '@prisma/client';
import { MailService } from 'src/core/mail/mail.service';
import { TokenConfirm } from 'src/core/hash/dto/token.confirm';
import { Unprocessable } from 'src/core/exception/unprocessable';
import { TokenType } from 'src/core/hash/enums/token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly mailerService: MailService,
  ) {}

  async login(data: LoginRequest): Promise<Tokens> {
    const user = await this.findUserByLogin(data.login);
    if (!user) {
      throw new Unauthorized(400005, 'Wrong login or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Unauthorized(400006, 'Wrong login or password');
    }

    const isPasswordValid = await this.hashService.comparePassword(
      data.password,
      user.hash,
    );
    if (!isPasswordValid) {
      throw new Unauthorized(400007, 'Wrong login or password');
    }

    const u = await this.userService.update({
      id: user.id,
      session: this.hashService.random(16),
    });

    return await this.hashService.tokens(u);
  }

  async signup(auth: SignUpRequest): Promise<User> {
    return await this.userService.create({
      id: this.hashService.uuid7(),
      firstName: auth.firstName,
      lastName: auth.lastName,
      email: auth.email,
      phone: auth.phone,
      hash: await this.hashService.hashPassword(auth.password),
      session: this.hashService.random(16),
      status: UserStatus.PENDING,
      roles: [Roles.USER],
    });
  }

  async findUserByLogin(login: string): Promise<User | null> {
    return await this.userService.findByLogin(login);
  }

  async confirmToken(user: User): Promise<string> {
    return await this.hashService.confirmToken(user);
  }

  async sendConfirmationEmail(user: User, token: string) {
    return await this.mailerService.confirmUser(user, token);
  }

  async logout(user: User): Promise<User> {
    return await this.userService.update({
      id: user.id,
      session: this.hashService.random(16),
    });
  }

  async refresh(user: User): Promise<Tokens> {
    const u = await this.userService.update({
      id: user.id,
      session: this.hashService.random(16),
    });
    return await this.hashService.tokens(u);
  }

  async confirmUser(token: string): Promise<User> {
    const jwtPayload = <TokenConfirm>await this.hashService.decodeAsync(token);
    if (jwtPayload.type !== TokenType.CONFIRM_EMAIL) {
      throw new Unprocessable(500007, 'Wrong type token');
    }
    const user = await this.userService.findById(jwtPayload.sub);
    if (
      !user ||
      user.session !== jwtPayload.session ||
      user.status !== UserStatus.PENDING
    ) {
      throw new Unprocessable(500008, 'Wrong user arguments');
    }
    return await this.userService.update({
      id: user.id,
      status: UserStatus.ACTIVE,
      confirmAt: new Date(),
      session: this.hashService.random(16),
    });
  }
}
