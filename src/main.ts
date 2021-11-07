import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as Sentry from '@sentry/node';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Tracing from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  Sentry.init({
    dsn: 'https://33ff01554543479882d0dfad5066294f@o1006423.ingest.sentry.io/5966837',

    tracesSampleRate: 1.0,
    release: process.env.SENTRY_RELEASE,
    attachStacktrace: true,
    integrations: [
      new RewriteFrames({ root: __dirname || process.cwd() }),
      new Sentry.Integrations.Http({ tracing: true }),
    ],
  });

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('SalesHelper API')
    .setDescription('This is the API documentation for SalesHelper project.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.use(helmet());
  app.enableCors({ origin: ['localhost:4000', 'after-sale.pl'], credentials: true });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
