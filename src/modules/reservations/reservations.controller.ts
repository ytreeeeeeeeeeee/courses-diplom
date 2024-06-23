import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesAccess } from 'src/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';
import { ValidationCustomPipe } from 'src/pipes/validation.pipe';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Request } from 'express';
import { IUserInfo } from '../auth/interfaces/auth.interface';
import { IReservation } from './interfaces/response.interface';
import { ReservationsService } from './reservations.service';
import { ID } from 'src/types/common.type';
import { ObjectIdValiadtionPipe } from 'src/pipes/objectid-validation.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT)
  @Post('client/reservations')
  public async addReservation(
    @Req() req: Request & { user: IUserInfo },
    @Body(ValidationCustomPipe) data: CreateReservationDto,
  ): Promise<IReservation> {
    const reservation = await this.reservationsService.addReservation({
      userId: req.user.id,
      ...data,
    });

    return {
      startDate: reservation.dateStart.toISOString(),
      endDate: reservation.dateEnd.toISOString(),
      hotelRoom: {
        description: reservation.roomId.description || null,
        images: reservation.roomId.images,
      },
      hotel: {
        title: reservation.hotelId.title,
        description: reservation.hotelId.description || null,
      },
    };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT)
  @Get('client/reservations')
  public async getReservationsByClient(
    @Req() req: Request & { user: IUserInfo },
  ): Promise<IReservation[]> {
    const reservations = await this.reservationsService.getReservations({
      userId: req.user.id,
    });

    return reservations.map<IReservation>((reservation) => {
      console.log(reservation);
      return {
        startDate: reservation.dateStart.toISOString(),
        endDate: reservation.dateEnd.toISOString(),
        hotelRoom: {
          description: reservation.roomId.description || null,
          images: reservation.roomId.images,
        },
        hotel: {
          title: reservation.hotelId.title,
          description: reservation.hotelId.description || null,
        },
      };
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT)
  @Delete('client/reservations/:id')
  public async cancelReservationByClient(
    @Req() req: Request & { user: IUserInfo },
    @Param('id', ObjectIdValiadtionPipe) id: ID,
  ): Promise<void> {
    return this.reservationsService.removeReservation(id, req.user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.MANAGER)
  @Get('manager/reservations/:userId')
  public async getReservationsByManager(
    @Param('userId', ObjectIdValiadtionPipe) userId: ID,
  ): Promise<IReservation[]> {
    const reservations = await this.reservationsService.getReservations({
      userId: userId,
    });

    return reservations.map<IReservation>((reservation) => {
      return {
        startDate: reservation.dateStart.toISOString(),
        endDate: reservation.dateEnd.toISOString(),
        hotelRoom: {
          description: reservation.roomId.description || null,
          images: reservation.roomId.images,
        },
        hotel: {
          title: reservation.hotelId.title,
          description: reservation.hotelId.description || null,
        },
      };
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.MANAGER)
  @Delete('manager/reservations/:id')
  public async cancelReservationByManager(
    @Req() req: Request & { user: IUserInfo },
    @Param('id', ObjectIdValiadtionPipe) id: ID,
  ): Promise<void> {
    return this.reservationsService.removeReservation(id, req.user);
  }
}
