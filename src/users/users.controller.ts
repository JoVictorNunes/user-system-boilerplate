import { createHash } from 'node:crypto';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { UsersService } from 'users/users.service';
import { RegisterDTO } from 'users/dto/register.dto';
import { AuthDTO } from 'users/dto/auth.dto';
import Unprotected from 'decorators/Unprotected';

@Controller()
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly env: ConfigService,
  ) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.service.getAllUsers();
    const usersMapped = users.map((user) => ({
      id: user.id,
      email: user.email,
    }));

    return usersMapped;
  }

  @Post('register')
  @Unprotected()
  async register(@Body() body: RegisterDTO, @Res() response: Response) {
    const { email, password } = body;
    const existingUser = await this.service.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const hash = createHash('sha256');

    hash.update(password);

    const hashedPassword = hash.digest('hex');

    const data = {
      email,
      password: hashedPassword,
    };
    const user = await this.service.createUser(data);

    response.status(201).json({
      id: user.id,
      email: user.email,
    });
  }

  @Post('auth')
  @Unprotected()
  async auth(@Body() body: AuthDTO, @Res() response: Response) {
    const { email, password } = body;
    const hash = createHash('sha256');

    hash.update(password);

    const hashedPassword = hash.digest('hex');
    const existingUser = await this.service.findByEmailAndPassword(
      email,
      hashedPassword,
    );

    if (existingUser) {
      const token = sign(
        { id: existingUser.id, email: existingUser.email },
        this.env.get<string>('SECRET', ''),
        { expiresIn: '2h' },
      );

      response.status(200).json({ token });
    }

    throw new NotFoundException('User does not exist');
  }
}
