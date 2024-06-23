import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupportRequestsService } from './services/requests.service';
import { SupportRequestsClientService } from './services/requests-client.service';
import { SupportRequestsEmployeeService } from './services/requests-employee.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesAccess } from 'src/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';
import { ValidationCustomPipe } from 'src/pipes/validation.pipe';
import { Request } from 'express';
import { IUserInfo } from '../auth/interfaces/auth.interface';
import {
  IClientSupportRequest,
  IManagerSupportRequest,
  IMessage,
} from './interfaces/response.interface';
import { GetChatListParamsDto } from './dto/get-chats-list.dto';
import { ID } from 'src/types/common.type';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { ObjectIdValiadtionPipe } from 'src/pipes/objectid-validation.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller()
export class SupportController {
  constructor(
    private readonly requestsService: SupportRequestsService,
    private readonly clientRequestsService: SupportRequestsClientService,
    private readonly employeeRequestsService: SupportRequestsEmployeeService,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT)
  @Post('client/support-requests')
  public async createSupportRequestByClient(
    @Req() req: Request & { user: IUserInfo },
    @Body('text') text: string,
  ): Promise<IClientSupportRequest> {
    const request = await this.clientRequestsService.createSupportRequest({
      user: req.user.id,
      text: text,
    });

    return {
      id: request.id,
      createdAt: request.createdAt.toISOString(),
      isActive: request.isActive ?? true,
      hasNewMessages: await request.hasNewMessages(),
    };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT)
  @Get('client/support-requests')
  public async getSupportRequestsByClient(
    @Req() req: Request & { user: IUserInfo },
    @Query(ValidationCustomPipe) params: GetChatListParamsDto,
  ): Promise<IClientSupportRequest[]> {
    const requests = await this.requestsService.findSupportRequests({
      user: req.user.id,
      ...params,
    });

    return Promise.all(
      requests.map<Promise<IClientSupportRequest>>(async (request) => {
        return {
          id: request.id,
          createdAt: request.createdAt.toISOString(),
          isActive: request.isActive ?? true,
          hasNewMessages: await request.hasNewMessages(),
        };
      }),
    );
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.MANAGER)
  @Get('manager/support-requests')
  public async getSupportRequestsByManager(
    @Query(ValidationCustomPipe) params: GetChatListParamsDto,
  ): Promise<IManagerSupportRequest[]> {
    const requests = await this.requestsService.findSupportRequests({
      user: null,
      ...params,
    });

    return Promise.all(
      requests.map<Promise<IManagerSupportRequest>>(async (request) => {
        return {
          id: request.id,
          createdAt: request.createdAt.toISOString(),
          isActive: request.isActive ?? true,
          hasNewMessages: await request.hasNewMessages(),
          client: {
            id: request.user.id,
            email: request.user.email,
            name: request.user.name,
            contactPhone: request.user.contactPhone,
            role: request.user.role,
          },
        };
      }),
    );
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT, Role.MANAGER)
  @Get('common/support-requests/:id/messages')
  public async getMessages(
    @Param('id', ObjectIdValiadtionPipe) id: ID,
  ): Promise<IMessage[]> {
    const messages = await this.requestsService.getMessages(id);

    return messages.map<IMessage>((message) => {
      return {
        id: message.id,
        createdAt: message.sentAt.toISOString(),
        text: message.text,
        readAt: message.readAt ? message.readAt.toISOString() : false,
        author: {
          id: message.author.id,
          name: message.author.name,
        },
      };
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT, Role.MANAGER)
  @Post('common/support-requests/:id/messages')
  public async sendMessage(
    @Req() req: Request & { user: IUserInfo },
    @Param('id', ObjectIdValiadtionPipe) id: ID,
    @Body('text') text: string,
  ): Promise<IMessage> {
    const message = await this.requestsService.sendMessage({
      author: req.user.id,
      supportRequest: id,
      text: text,
    });

    return {
      id: message.id,
      createdAt: message.sentAt.toISOString(),
      text: message.text,
      readAt: message.readAt ? message.readAt.toISOString() : false,
      author: {
        id: message.author.id,
        name: message.author.name,
      },
    };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.CLIENT, Role.MANAGER)
  @Post('common/support-requests/:id/messages/read')
  public async readMessages(
    @Req() req: Request & { user: IUserInfo },
    @Param('id', ObjectIdValiadtionPipe) id: ID,
    @Body(ValidationCustomPipe) { createdBefore }: MarkAsReadDto,
  ): Promise<void> {
    if (req.user.role === Role.MANAGER) {
      return this.employeeRequestsService.markMessagesAsRead({
        user: req.user.id,
        supportRequest: id,
        createdBefore: new Date(createdBefore),
      });
    } else if (req.user.role === Role.CLIENT) {
      return this.clientRequestsService.markMessagesAsRead({
        user: req.user.id,
        supportRequest: id,
        createdBefore: new Date(createdBefore),
      });
    }
  }
}
