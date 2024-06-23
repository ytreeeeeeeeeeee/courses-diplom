import { BadRequestException, Injectable } from '@nestjs/common';
import {
  IHotelService,
  ISearchHotelParams,
  IUpdateHotelParams,
} from './interfaces/hotels.interface';
import { ID } from 'src/types/common.type';
import { Hotel } from './schemas/hotel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>,
  ) {}

  public async create(data: CreateHotelDto): Promise<Hotel> {
    return this.hotelModel.create(data);
  }

  public async findById(id: ID): Promise<Hotel> {
    return this.hotelModel.findById(id);
  }

  public async search(params: ISearchHotelParams): Promise<Hotel[]> {
    return this.hotelModel
      .find({ title: { $regex: new RegExp(params.title, 'i') } })
      .skip(params.offset)
      .limit(params.limit);
  }

  public async update(id: ID, data: IUpdateHotelParams): Promise<Hotel> {
    const hotel = await this.hotelModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!hotel) {
      throw new BadRequestException(`Гостиницы с id ${id} не существует`);
    }

    return hotel;
  }
}
