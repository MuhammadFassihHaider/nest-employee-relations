import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

/**
 * [x] create single task
 * [] create multiple tasks ?
 * [x] change task description
 * [x] search task by name
 * [x] delete one task
 * [x] delete all tasks
 * [] mark tasks as done ?
 * [x] get all tasks for a user
 */

@Injectable()
export class TaskService {
  private logger = new Logger();
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createTaskDto: CreateTaskDto, id: number) {
    const task = this.taskRepository.create(createTaskDto);
    const savedTask = await this.taskRepository.save(task);
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    employee.tasks?.push(savedTask);
    return await this.employeeRepository.save(employee);
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findAllTasksForEmployee(id: number) {
    return await this.taskRepository
      .createQueryBuilder('tasks')
      .select()
      .where('tasks.employeeId = :id', { id })
      .orderBy('id', 'ASC')
      .getMany();
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return await this.taskRepository.update({ id }, updateTaskDto);
  }

  async removeOne(taskId: number) {
    return await this.taskRepository.delete(taskId);
  }

  async removeAll(userId: number) {
    return await this.taskRepository
      .createQueryBuilder('task')
      .where('employeeId = :userId', { userId })
      .delete()
      .execute();
  }

  async searchTaskByName(searchParam: string, id: number) {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select()
      .where('task.employeeId = :id', { id })
      //LIKE is case sensitive, ILIKE is not
      .andWhere(`task.name ILIKE :q`, { q: '%' + `${searchParam}` + '%' })
      .getMany();
  }
}
