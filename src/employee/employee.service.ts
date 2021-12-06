import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactInfo } from 'src/contact-info/entities/contact-info.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EEmployeeRelations } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly empRepository: Repository<Employee>,
    @InjectRepository(ContactInfo)
    private readonly contactRepository: Repository<ContactInfo>,
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {}

  private async doesUserExist(createEmployeeDto: CreateEmployeeDto) {
    const doesUserExists = await this.contactRepository.findOne({
      where: {
        email: createEmployeeDto.contactInfo.email,
      },
    });
    return doesUserExists === undefined ? false : true;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    if (await this.doesUserExist(createEmployeeDto))
      throw new HttpException('User already exists', HttpStatus.OK);

    let manager: Employee = null;

    if (createEmployeeDto.managerId) {
      manager = await this.empRepository.findOne({
        id: createEmployeeDto.managerId,
      });
    }

    const contact = this.contactRepository.create(
      createEmployeeDto.contactInfo,
    );
    const contactInfo = await this.contactRepository.save(contact);

    const newEmployee = this.empRepository.create({
      name: createEmployeeDto.name,
      contactInfo,
      manager,
    });

    return await this.empRepository.save(newEmployee);
  }

  async findAll() {
    return await this.empRepository.find({
      relations: [EEmployeeRelations.ContactInfo],
    });
  }

  async findOne(id: number) {
    const employee = await this.empRepository.findOne({
      where: { id },
      relations: [
        EEmployeeRelations.ContactInfo,
        EEmployeeRelations.Meetings,
        EEmployeeRelations.Tasks,
        EEmployeeRelations.MeetingsCreated,
      ],
    });
    if (employee) return employee;
    else throw new NotFoundException();
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.empRepository.findOne(id);
    let contactInfo = await this.contactRepository
      .createQueryBuilder('contact')
      .select()
      .where('contact.employeeId = :id', { id })
      .getOne();

    employee.name = updateEmployeeDto.name;
    contactInfo = {
      ...contactInfo,
      ...updateEmployeeDto.contactInfo,
    };

    return {
      ...(await this.empRepository.save(employee)),
      contactInfo: await this.contactRepository.save(contactInfo),
    };
  }

  async remove(id: number) {
    return await this.empRepository.delete(id);
  }

  async createMeeting(id: number) {
    const employee = await this.empRepository.findOne({
      where: { id },
      relations: ['meetingsCreated', 'meetings'],
    });

    if (!employee) throw new NotFoundException('User not found!');

    const meeting = this.meetingRepository.create({
      zoomUrl: 'http://www.zoom.com/meeting/some-random-url',
    });
    meeting?.employee?.push(employee);
    const savedMeetingResponse = await this.meetingRepository.save(meeting);

    employee?.meetingsCreated?.push(savedMeetingResponse);
    employee?.meetings?.push(savedMeetingResponse);

    return await this.empRepository.save(employee);
  }
}
