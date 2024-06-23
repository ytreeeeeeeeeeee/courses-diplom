import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ICreateHotelRoom,
  IHotelRoomService,
  IUpdateHotelRoom,
  SearchRoomsParams,
} from './interfaces/hotels.interface';
import { ID } from 'src/types/common.type';
import { HotelRoom } from './schemas/hotel-room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';

@Injectable()
export class HotelRoomsService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private readonly hotelRoomModel: Model<HotelRoom>,
  ) {}

  public async create(data: ICreateHotelRoom): Promise<HotelRoom> {
    return (await this.hotelRoomModel.create(data)).populate('hotel');
  }

  public async findById(id: ID): Promise<HotelRoom> {
    return this.hotelRoomModel.findById(id).populate('hotel');
  }

  public async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    return params.isEnabled === undefined
      ? this.hotelRoomModel.find().populate('hotel')
      : this.hotelRoomModel
          .find({ hotel: params.hotel })
          .skip(params.offset)
          .limit(params.limit)
          .populate('hotel');
  }

  public async update(id: ID, data: IUpdateHotelRoom): Promise<HotelRoom> {
    const room = await this.hotelRoomModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('hotel');

    if (!room) {
      throw new BadRequestException(`Номера с id ${id} не существует`);
    }

    room.images
      .filter((image) => !data.images.includes(image))
      .forEach((image) => fs.unlinkSync(`public/${image}`));

    return room;
  }
}
