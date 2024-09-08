import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UserCreateRequest } from 'src/app/user/dto/request/user-create.request';
import { UserService } from 'src/app/user/user.service';
import { UserResponse } from 'src/app/user/dto/response/user.response';
import { UserStatus } from 'src/app/user/enum/user.status';
import { HashService } from 'src/core/hash/hash.service';
import { Roles } from 'src/app/role/enum/roles';
import { UserUpdateRequest } from 'src/app/user/dto/request/user-update.request';
import { UserListQuery } from 'src/app/user/dto/request/user-list.query';
import { RBAC } from 'src/app/auth/guard/role.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly userResponse: UserResponse,
  ) {}

  @Post()
  @RBAC([Roles.ADMIN])
  async create(@Body() req: UserCreateRequest, @Res() res: FastifyReply) {
    const user = await this.userService.create({
      id: req.id || this.hashService.uuid7(),
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      phone: req.phone,
      hash: await this.hashService.hashPassword(req.password),
      session: this.hashService.random(16),
      status: UserStatus.PENDING,
      roles: [Roles.USER],
    });

    return res
      .code(HttpStatus.CREATED)
      .send(this.userResponse.json({ model: user }));
  }

  @Put(':id')
  @RBAC([Roles.ADMIN])
  async update(@Body() req: UserUpdateRequest, @Res() res: FastifyReply) {
    const user = await this.userService.update({
      id: req.id,
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      phone: req.phone,
      hash: req.password
        ? await this.hashService.hashPassword(req.password)
        : undefined,
      status: UserStatus.PENDING,
      roles: req.roles,
    });

    return res
      .code(HttpStatus.CREATED)
      .send(this.userResponse.json({ model: user }));
  }

  @Get()
  async list(@Query() query: UserListQuery, @Res() res: FastifyReply) {
    const users = await this.userService.list(query.toFilter());
    return res
      .code(HttpStatus.OK)
      .send(
        await this.userResponse.json({ model: users, include: query.include }),
      );
  }
}
