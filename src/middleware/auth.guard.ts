import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token missing');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      request['user'] = decoded; 
      return true;
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
