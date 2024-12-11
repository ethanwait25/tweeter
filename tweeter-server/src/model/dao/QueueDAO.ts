import { StatusDTO } from "tweeter-shared";

export interface QueueDAO {
    createPostUpdateMessage(status: StatusDTO): Promise<void>;
    createUpdateFeedsMessage(followers: string[], post: StatusDTO): Promise<void>;
    sendMessage(body: any, url: string): Promise<void>;
}