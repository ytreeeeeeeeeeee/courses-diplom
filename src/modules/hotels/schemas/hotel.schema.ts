import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Hotel extends Document {
  @Prop({ required: true, unique: true })
  public title: string;

  @Prop()
  public description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
