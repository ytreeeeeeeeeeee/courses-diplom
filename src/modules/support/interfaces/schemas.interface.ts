import { SupportRequest } from '../schemas/support-request.schema';

export interface ISupportReqeustSchema extends SupportRequest {
  hasNewMessages(): Promise<boolean>;
}
