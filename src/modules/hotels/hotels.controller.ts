import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesAccess } from 'src/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';
import { ValidationCustomPipe } from 'src/pipes/validation.pipe';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { IHotel } from './interfaces/response.interface';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ID } from 'src/types/common.type';
import { ObjectIdValiadtionPipe } from 'src/pipes/objectid-validation.pipe';
import { SearchHotelDto } from './dto/search-hotel.dto';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
@RolesAccess(Role.ADMIN)
@Controller('admin/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  public async createHotel(
    @Body(ValidationCustomPipe) data: CreateHotelDto,
  ): Promise<IHotel> {
    const hotel = await this.hotelsService.create(data);

    return {
      id: hotel.id,
      title: hotel.title,
      description: hotel.description || null,
    };
  }

  @Get()
  public async getHotels(
    @Query(ValidationCustomPipe) params: SearchHotelDto,
  ): Promise<IHotel[]> {
    const hotels = await this.hotelsService.search(params);

    return hotels.map<IHotel>((hotel) => {
      return {
        id: hotel.id,
        title: hotel.title,
        description: hotel.description || null,
      };
    });
  }

  @Put(':id')
  public async updateHotel(
    @Param('id', ObjectIdValiadtionPipe) id: ID,
    @Body(ValidationCustomPipe) data: UpdateHotelDto,
  ): Promise<IHotel> {
    const hotel = await this.hotelsService.update(id, data);

    return {
      id: hotel.id,
      title: hotel.title,
      description: hotel.description || null,
    };
  }
}
