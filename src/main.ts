import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/all_exception';

async function bootstrap() {
  const { PORT } = process.env;

  const api = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn'], 
    cors: true,
  });

  // ** swagger v2
  const config = new DocumentBuilder()
    .setTitle('API PROTECT TOP 10 OWASP')
    .setDescription('Nguyen Cao Phong - N19DCAT060')
    .setContact('PTIT', '', 'ptit.support@gmail.com')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer(`http://localhost:${process.env.PORT}`)
    .addOAuth2()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(api, config);
  SwaggerModule.setup('swagger', api, document);

  const { httpAdapter } = api.get(HttpAdapterHost);
  api.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  api.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await api.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
  });
  // ** end
}
bootstrap();
