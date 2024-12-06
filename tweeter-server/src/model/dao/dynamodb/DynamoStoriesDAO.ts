import {
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { StatusDTO } from "tweeter-shared";
import { StoriesDAO } from "../StoriesDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoStoriesDAO extends DynamoDAO implements StoriesDAO {
  readonly tableName = "tweeter-stories";
  readonly aliasAttrName = "alias";
  readonly timestampAttrName = "timestamp";
  readonly postAttrName = "post";

  constructor() {
    super();
  }

  async getStoryItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    const params = {
      KeyConditionExpression: this.aliasAttrName + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastItem == null
          ? undefined
          : {
              [this.aliasAttrName]: alias,
              [this.timestampAttrName]: lastItem?.timestamp,
            },
    };

    const items: StatusDTO[] = [];
    try {
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
        items.push({
          user: {
            alias: item[this.aliasAttrName],
            firstName: "",
            lastName: "",
            imageUrl: "",
          },
          timestamp: item[this.timestampAttrName],
          post: item[this.postAttrName],
        });
      });
      return [items, hasMorePages];
    } catch (e) {
      throw new Error(
        `[Server Error]: Could not get stories for user ${alias}: ` + e
      );
    }
  }

  async postStoryItem(story: StatusDTO): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttrName]: story.user.alias,
        [this.timestampAttrName]: story.timestamp,
        [this.postAttrName]: story.post,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Post from ${story.user} created successfully`);
    } catch (e) {
      console.error(`Could not create post from ${story.user}: ${e}`);
      throw new Error(
        `[Server Error]: Could not create post from ${story.user}:` + e
      );
    }
  }
}
