import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user_id: string): Promise<Task> {
    createTaskDto.user_id = user_id;
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  findAll(user_id: string): Promise<Task[]> {
    return this.taskModel.find({ user_id: user_id }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: string, updateTaskDto: UpdateTaskDto, user_id: string) {
    console.log(updateTaskDto);
    console.log(id);
    console.log(user_id);
    return this.taskModel.findOneAndUpdate({ _id: id, user_id: user_id }, updateTaskDto, { new: true }).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
