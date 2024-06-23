import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from './hotel.schema';

@Schema({ versionKey: false, timestamps: true })
export class HotelRoom extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: Hotel.name })
  public hotel: Hotel;

  @Prop()
  public description: string;

  @Prop({ default: [] })
  public images: string[];

  @Prop({ required: true, default: true })
  public isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
