import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { EmployeeModule } from './employee/employee.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { TaskModule } from './task/task.module';
import { MeetingModule } from './meeting/meeting.module';

const TypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  database: 'employees',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      password: process.env.DB_PASSWORD,
    }),
    EmployeeModule,
    ContactInfoModule,
    TaskModule,
    MeetingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
