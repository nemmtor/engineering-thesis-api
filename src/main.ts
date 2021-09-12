import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  Sentry.init({
    dsn: 'https://99c2626090d741d99fd245e85023d9d0@o996703.ingest.sentry.io/5955194',
    integrations: [new RewriteFrames({ root: process.cwd() })],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('SalesHelper API')
    .setDescription('This is the API documentation for SalesHelper project.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
