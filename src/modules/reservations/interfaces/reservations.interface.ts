import { ID } from 'src/types/common.type';
import { Reservation } from '../schemas/reservation.schema';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { IUserInfo } from 'src/modules/auth/interfaces/auth.interface';

export interface ReservationSearchOptions {
  userId?: ID;
  dateStart?: Date;
  dateEnd?: Date;
}

export interface ICreateReservationParams {
  userId: ID;
  roomId: ID;
  dateStart: string;
  dateEnd: string;
}

export interface IReservationService {
  addReservation(data: CreateReservationDto): Promise<Reservation>;
  removeReservation(id: ID, user: IUserInfo): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
