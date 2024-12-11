import { StatusDTO } from "tweeter-shared";
import { QueueDAO } from "../QueueDAO";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SQSQueueDAO implements QueueDAO {
  client = new SQSClient({ region: "us-east-2" });
  feedQueueUrl =
    "https://sqs.us-east-2.amazonaws.com/211125619169/tweeter-feedq";
  postsQueueUrl =
    "https://sqs.us-east-2.amazonaws.com/211125619169/tweeter-postsq";

  async createPostUpdateMessage(status: StatusDTO): Promise<void> {
    await this.sendMessage(JSON.stringify(status), this.postsQueueUrl);
  }

  async createUpdateFeedsMessage(followers: string[], post: StatusDTO): Promise<void> {
    const message = {followers, post};
    await this.sendMessage(JSON.stringify(message), this.feedQueueUrl);
  }

  async sendMessage(body: any, url: string): Promise<void> {
    const params = {
      DelaySeconds: 10,
      MessageBody: body,
      QueueUrl: url,
    };

    try {
      const data = await this.client.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
        console.error(`Error in sending message ${body} to ${url}:`, err);
      throw err;
    }
  }
}
