import { IsUrl } from 'class-validator';
import { Employee } from 'src/employee/entities/employee.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  @IsUrl()
  zoomUrl: string;

  @ManyToMany(() => Employee, (employee) => employee.meetings)
  employee: Employee[];

  @ManyToOne(() => Employee, (employee) => employee.meetingsCreated)
  @JoinColumn()
  createdBy: Employee;
}
