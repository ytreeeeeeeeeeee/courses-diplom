import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelRoomsService } from './hotel-rooms.service';
import { HotelsController } from './hotels.controller';
import { HotelRoomsController } from './hotel-rooms.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  providers: [HotelsService, HotelRoomsService],
  controllers: [HotelsController, HotelRoomsController],
  exports: [HotelRoomsService],
})
export class HotelsModule {}
