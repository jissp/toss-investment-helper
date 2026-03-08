import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Class Validator 적용
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            skipMissingProperties: false,
            skipUndefinedProperties: false,
            skipNullProperties: false,
            errorHttpStatusCode: 400,
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
