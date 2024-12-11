import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";
import { StatusDTO } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (event: any) => {
  const statusService = new StatusService(new DynamoFactory());
  const { body } = event.Records[0];
  const feedUpdate: { followers: string[]; post: StatusDTO } = JSON.parse(body);
  
  await statusService.addStatusToFeeds(feedUpdate.followers, feedUpdate.post);
};
