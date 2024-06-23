import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Message } from './message.schema';

@Schema({ versionKey: false })
export class SupportRequest extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  public user: User;

  @Prop({ type: Date, required: true, default: new Date() })
  public createdAt: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: Message.name }], default: [] })
  public messages: Message[];

  @Prop()
  public isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);

SupportRequestSchema.methods.hasNewMessages =
  async function (): Promise<boolean> {
    return (
      await this.populate({ path: 'messages', model: Message.name })
    ).messages.some((message: Message) => !message.readAt);
  };
