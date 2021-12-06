import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { ContactInfo } from 'src/contact-info/entities/contact-info.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [TypeOrmModule.forFeature([Employee, ContactInfo, Meeting])],
})
export class EmployeeModule {}
