import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import * as fs from 'fs';
import { v2 as cloundinary } from 'cloudinary';


@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      const bufferFile = await fs.readFileSync(file.path);
      toStream(bufferFile).pipe(upload);
    });
  }


  async getImageInfoFromUrl(imageUrl: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.explicit(imageUrl, { type: 'fetch' }, (error, result) => {
        if (error) {
          console.error('Error from Cloudinary API:', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
