import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';

export function multerOptions() {
  return {
    // Check the mime types to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
      cb(null, true);

      if (
        file.mimetype.match(/\/(jpg|jpeg|png|gif|heic)$/) ||
        file.mimetype == 'application/pdf'
      ) {
      } else {
        cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    },
    // Storage properties
    storage: diskStorage({
      destination: async (req: any, file: any, cb: any) => {
        const rootPathUploadDir = path.resolve(
          __dirname,
          `../../../../${process.env.DIR_UPLOADS}/`,
        );
        if (!existsSync(`${rootPathUploadDir}`)) {
          mkdirSync(rootPathUploadDir, { recursive: true });
        }
        cb(null, rootPathUploadDir);
      },
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/ /g, '-'));
      },
    }),
    // ** Enable file size limits
    limits: {
      fileSize: +(70 * 1024 * 1024),
    },
  };
}
