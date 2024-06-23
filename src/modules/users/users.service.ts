import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUserService, SearchUserParams } from './interfaces/users.interface';
import { ID } from 'src/types/common.type';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async create(data: CreateUserDto): Promise<User> {
    const isExists =
      (await this.userModel.find({ email: data.email })).length > 0;

    if (isExists) {
      throw new BadRequestException(`Email ${data.email} уже занят`);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = new this.userModel({
      email: data.email,
      name: data.name,
      passwordHash: passwordHash,
      contactPhone: data.contactPhone,
      role: data.role,
    });

    return newUser.save();
  }

  public async findById(id: ID): Promise<User | null> {
    return this.userModel.findById(id);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email });
  }

  public async findAll(params: SearchUserParams): Promise<User[]> {
    return this.userModel
      .find({
        $and: [
          {
            name: { $regex: new RegExp(params.name, 'i') },
            email: { $regex: new RegExp(params.email, 'i') },
            contactPhone: { $regex: new RegExp(params.contactPhone, 'i') },
          },
        ],
      })
      .skip(params.offset)
      .limit(params.limit);
  }
}
