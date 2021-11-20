import { Employee } from 'src/employee/entities/employee.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  phone: number;

  @Column()
  email: string;

  @OneToOne(() => Employee, (employee) => employee.contactInfo, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  employee: Employee;
}
