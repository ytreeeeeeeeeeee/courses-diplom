import { ID } from 'src/types/common.type';

export interface IHotelRoom {
  id: ID;
  description: string | null;
  images: string[];
  hotel: IHotel;
}

export interface IHotel {
  id: ID;
  title: string;
  description: string | null;
}
