import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const UserId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = authorizationHeader.split('Bearer ')[1];

    if (!token) {
      throw new Error('Token is missing');
    }

    const jwtService = new JwtService({ secret: process.env.JWT_SECRET_KEY });
    const decoded = await jwtService.verifyAsync(token);

    return decoded.sub;
  },
);
