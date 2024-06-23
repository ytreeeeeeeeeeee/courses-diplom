import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/roles.enum';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public passwordHash: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public contactPhone: string;

  @Prop({ required: true, enum: Role, default: Role.CLIENT })
  public role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
