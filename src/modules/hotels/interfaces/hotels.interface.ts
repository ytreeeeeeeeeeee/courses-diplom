import { ID } from 'src/types/common.type';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { Hotel } from '../schemas/hotel.schema';
import { CreateHotelDto } from '../dto/create-hotel.dto';

export interface ISearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

export interface IUpdateHotelParams {
  title?: string;
  description?: string;
}

export interface ICreateHotelRoom {
  hotel: ID;
  images: string[];
  description?: string;
  isEnabled?: boolean;
}

export interface IUpdateHotelRoom {
  hotel?: ID;
  images?: string[];
  description?: string;
  isEnabled?: boolean;
}

export interface IHotelService {
  create(data: CreateHotelDto): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: ISearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: IUpdateHotelParams): Promise<Hotel>;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: ID;
  isEnabled?: boolean;
}

export interface IHotelRoomService {
  create(data: ICreateHotelRoom): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: IUpdateHotelRoom): Promise<HotelRoom>;
}
