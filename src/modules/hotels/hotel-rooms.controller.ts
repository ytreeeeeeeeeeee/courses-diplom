import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelRoomsService } from './hotel-rooms.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ValidationCustomPipe } from 'src/pipes/validation.pipe';
import { SearchRoomsParams } from './interfaces/hotels.interface';
import { IHotelRoom } from './interfaces/response.interface';
import { RolesAccess } from 'src/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';
import { ID } from 'src/types/common.type';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { UpdateHotelRoomDto } from './dto/update-hotel-room.dto';
import { ObjectIdValiadtionPipe } from 'src/pipes/objectid-validation.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller()
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Get('common/hotel-rooms')
  public async getHotelRooms(
    @Query(ValidationCustomPipe) params: SearchRoomsParams,
  ): Promise<IHotelRoom[]> {
    const rooms = await this.hotelRoomsService.search(params);

    return rooms.map<IHotelRoom>((room) => {
      return {
        id: room.id,
        description: room.description || null,
        images: room.images,
        hotel: {
          id: room.hotel.id,
          title: room.hotel.title,
          description: room.hotel.description || null,
        },
      };
    });
  }

  @Get('common/hotel-rooms/:id')
  public async getHotelRoom(
    @Param('id', ObjectIdValiadtionPipe) id: ID,
  ): Promise<IHotelRoom> {
    const room = await this.hotelRoomsService.findById(id);

    return {
      id: room.id,
      description: room.description || null,
      images: room.images,
      hotel: {
        id: room.hotel.id,
        title: room.hotel.title,
        description: room.hotel.description || null,
      },
    };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10, { dest: 'public/images' }))
  @Post('admin/hotel-rooms')
  public async createHotelRooms(
    @Body(ValidationCustomPipe) data: CreateHotelRoomDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ })],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<IHotelRoom> {
    const images = files.map<string>((file) => `images/${file.filename}`);

    const room = await this.hotelRoomsService.create({
      ...data,
      images,
    });

    return {
      id: room.id,
      description: room.description || null,
      images: room.images,
      hotel: {
        id: room.hotel.id,
        title: room.hotel.title,
        description: room.hotel.description || null,
      },
    };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10, { dest: 'public/images' }))
  @Put('admin/hotel-rooms/:id')
  public async updateHotelRoom(
    @Param('id', ObjectIdValiadtionPipe) id: ID,
    @Body(ValidationCustomPipe) data: UpdateHotelRoomDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ })],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ): Promise<IHotelRoom> {
    const images = files
      ? files.map<string>((file) => `images/${file.filename}`)
      : [];

    if (data.images) {
      images.push(...data.images);
    }

    const room = await this.hotelRoomsService.update(id, {
      images: images,
      ...data,
    });

    return {
      id: room.id,
      description: room.description || null,
      images: room.images,
      hotel: {
        id: room.hotel.id,
        title: room.hotel.title,
        description: room.hotel.description || null,
      },
    };
  }
}
