/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import multer from 'multer';
import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import os from 'os';
import { fileValidation } from './multer.filevalidation';
import { storeType } from 'src/common/enums';
export const multerCloud = ({
  fileType = fileValidation.image,
  // storeType = storeType.memory,
}: {
  fileType?: string[];
  storeType?: storeType;
}) => {
  return {
    storage:
      storeType === storeType
        ? multer.memoryStorage()
        : multer.diskStorage({
            destination: os.tmpdir(),
            filename: (req: Request, file: Express.Multer.File, cb) => {
              cb(null, `${Date.now()}-${file.originalname}`);
            },
          }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      if (!fileType.includes(file.mimetype)) {
        cb(new BadRequestException('Invalid file type'));
      } else {
        cb(null, true);
      }
    },
  };
};
