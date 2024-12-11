import { StatusDTO } from "tweeter-shared";
import { DynamoFollowsDAO } from "../../model/dao/dynamodb/DynamoFollowsDAO";
import { SQSQueueDAO } from "../../model/dao/dynamodb/SQSQueueDAO";

export const handler = async (event: any) => {
  const followsDAO = new DynamoFollowsDAO();
  const queueDAO = new SQSQueueDAO();

  for (let i = 0; i < event.Records.length; i++) {
    const { body } = event.Records[i];
    const post: StatusDTO = JSON.parse(body).status;

    var lastFollower: string | undefined = undefined;
    var followers: string[] = [];
    var hasMore = true;
    while (hasMore) {
      [followers, hasMore] = await followsDAO.getFollowers(
        post.user.alias,
        25,
        lastFollower
      );
      lastFollower = followers[followers.length - 1];
      await queueDAO.createUpdateFeedsMessage(followers, post);
    }
  }
};
