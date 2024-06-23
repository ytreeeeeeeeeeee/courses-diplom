import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({ versionKey: false })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  public author: User;

  @Prop({ required: true, default: new Date() })
  public sentAt: Date;

  @Prop({ required: true })
  public text: string;

  @Prop()
  public readAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
