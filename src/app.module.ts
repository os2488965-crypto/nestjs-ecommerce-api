import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () =>
          console.log(
            `Connected to MongoDB successfully on ${process.env.MONGO_URL}`,
          ),
        );
        return connection;
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
