import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloundinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  import: [ConfigModule],
  useFactory: (configService: ConfigService): any => {
    return cloundinary.config({
      cloud_name: configService.get<string>('CLOUNDINARY_NAME'),
      api_key: configService.get<string>('CLOUNDINARY_KEY'),
      api_secret: configService.get<string>('CLOUNDINARY_SECURITY'),
    });
  },
  inject: [ConfigService],
};
