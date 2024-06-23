import { Module } from '@nestjs/common';
import { SupportRequestsService } from './services/requests.service';
import { SupportRequestsClientService } from './services/requests-client.service';
import { SupportRequestsEmployeeService } from './services/requests-employee.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support-request.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { SupportController } from './support.controller';
import { SupportGateway } from './support.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [
    SupportRequestsService,
    SupportRequestsClientService,
    SupportRequestsEmployeeService,
    SupportGateway,
  ],
  controllers: [SupportController],
})
export class SupportModule {}
