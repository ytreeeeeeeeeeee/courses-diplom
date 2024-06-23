import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HotelRoom } from 'src/modules/hotels/schemas/hotel-room.schema';
import { Hotel } from 'src/modules/hotels/schemas/hotel.schema';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({ versionKey: false })
export class Reservation extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  public userId: User;

  @Prop({ type: Types.ObjectId, required: true, ref: Hotel.name })
  public hotelId: Hotel;

  @Prop({ type: Types.ObjectId, required: true, ref: HotelRoom.name })
  public roomId: HotelRoom;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
