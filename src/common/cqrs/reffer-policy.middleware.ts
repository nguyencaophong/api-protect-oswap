// referrer-policy.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ReferrerPolicyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Referrer-Policy', 'same-origin'); // Change to your desired policy
    next();
  }
}
