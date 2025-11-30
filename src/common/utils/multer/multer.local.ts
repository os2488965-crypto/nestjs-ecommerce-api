/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import multer from 'multer';
import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

export const multerLocal = ({ fileTypes = [] }: { fileTypes?: string[] }) => {
  return {
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, './uploads');
      },
      filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, Date.now() + '_' + file.originalname);
      },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      if (fileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type'));
      }
    },
  };
};
