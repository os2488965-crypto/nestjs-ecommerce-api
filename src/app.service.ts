import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class AppService {
  constructor() {}

  getHello(req: Request, res: Response): Response {
    return res.status(200).json({ message: 'Welcome to our API' });
  }
}
