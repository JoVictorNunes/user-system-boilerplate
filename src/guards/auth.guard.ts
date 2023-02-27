import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly env: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const unprotected = this.reflector.get<boolean>(
      'unprotected',
      context.getHandler(),
    );

    if (unprotected === true) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new BadRequestException('You must provide an authorization header');
    }

    const type = authorization.split(' ')[0];
    const token = authorization.split(' ')[1];

    if (type !== 'Bearer' || !token) {
      throw new BadRequestException('Invalid authorization header');
    }

    try {
      verify(token, this.env.get<string>('SECRET', ''));
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
