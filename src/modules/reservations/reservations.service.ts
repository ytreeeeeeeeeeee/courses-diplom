import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  ICreateReservationParams,
  IReservationService,
  ReservationSearchOptions,
} from './interfaces/reservations.interface';
import { ID } from 'src/types/common.type';
import { Reservation } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserInfo } from '../auth/interfaces/auth.interface';
import { Role } from '../users/enums/roles.enum';
import { HotelRoomsService } from '../hotels/hotel-rooms.service';

@Injectable()
export class ReservationsService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    private readonly hotelRoomsService: HotelRoomsService,
  ) {}

  public async addReservation(
    data: ICreateReservationParams,
  ): Promise<Reservation> {
    const start = new Date(data.dateStart);
    const end = new Date(data.dateEnd);

    const isRoomOccupied =
      (
        await this.reservationModel.find({
          $and: [
            {
              roomId: data.roomId,
              $or: [
                {
                  dateStart: { $gte: start, $lte: end },
                  dateEnd: { $gte: start, $lte: end },
                },
              ],
            },
          ],
        })
      ).length > 0;

    if (isRoomOccupied) {
      throw new BadRequestException(
        `Комната ${data.roomId} занята на даты с ${start.toISOString()} по ${end.toISOString()}`,
      );
    }

    const room = await this.hotelRoomsService.findById(data.roomId);

    return (
      await this.reservationModel.create({ hotelId: room.hotel.id, ...data })
    ).populate(['hotelId', 'roomId']);
  }

  public async removeReservation(id: ID, user: IUserInfo): Promise<void> {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('userId');

    if (!reservation) {
      throw new BadRequestException(`Брони с id ${id} не существует`);
    }

    if (user.role === Role.CLIENT && reservation.userId.id !== user.id) {
      throw new ForbiddenException(
        `Бронь с id ${id} не принадлежит пользователю с id ${user.id}`,
      );
    }

    await reservation.deleteOne();
  }

  public async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Reservation[]> {
    return this.reservationModel.find(filter).populate(['hotelId', 'roomId']);
  }
}
