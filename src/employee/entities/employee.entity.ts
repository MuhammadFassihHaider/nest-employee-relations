import { MaxLength, MinLength } from 'class-validator';
import { ContactInfo } from 'src/contact-info/entities/contact-info.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.employee, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contactInfo: ContactInfo;

  @OneToMany(() => Task, (task) => task.employee, { nullable: true })
  tasks: Task[];

  // self referance -- start
  @ManyToOne(() => Employee, (employee) => employee.employeeReports, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  manager: Employee;

  @OneToMany(() => Employee, (employee) => employee.manager, { nullable: true })
  employeeReports: Employee[];
  // self referance -- end

  @ManyToMany(() => Meeting, (meeting) => meeting.employee, { nullable: true })
  @JoinTable()
  meetings: Meeting[];

  @OneToMany(() => Meeting, (meeting) => meeting.createdBy, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  meetingsCreated: Meeting[];
}

export enum EEmployeeRelations {
  ContactInfo = 'contactInfo',
  Tasks = 'tasks',
  Manager = 'manager',
  EmployeeReports = 'employeeReports',
  Meetings = 'meetings',
  MeetingsCreated = 'meetingsCreated',
}
