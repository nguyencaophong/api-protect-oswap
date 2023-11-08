import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { EKeyPrefixRedis, EQueueName } from 'src/common/enum';
import { Job, Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { toString } from 'src/common/utils';

@Processor(EQueueName.RESET_STATUS_LOGIN)
export class AuthConsumer {
  constructor(
    // ** Services 
    private configService: ConfigService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  @Process('reset-status-login')
  async resetStatusLogin(job: Job<{ id: number }>) {
    const data = job.data;
    await this.cacheManager.set(toString(`${data.id}-${EKeyPrefixRedis.LOGIN_FAILED}`), 0)
  }
}
