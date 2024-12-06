import {
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Status, StatusDTO } from "tweeter-shared";
import { FeedsDAO } from "../FeedsDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFeedsDAO extends DynamoDAO implements FeedsDAO {
  readonly tableName = "tweeter-feeds";
  readonly aliasAttrName = "follower_alias";
  readonly timestampAttrName = "timestamp";
  readonly postAttrName = "post";
  readonly authorAttrName = "author_alias";

  constructor() {
    super();
  }

  async addFeedItem(alias: string, status: StatusDTO): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttrName]: alias,
        [this.timestampAttrName]: status.timestamp,
        [this.postAttrName]: status.post,
        [this.authorAttrName]: status.user.alias,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Feed item created successfully for user ${alias}`);
    } catch (e) {
      console.error(`Could not create feed item for user ${alias}: ${e}`);
      throw new Error(
        `[Server Error]: Could not create feed item for user ${alias}:` + e
      );
    }
  }

  async getFeedItems(
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
            alias: item[this.authorAttrName],
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
        `[Server Error]: Could not get feed for user ${alias}: ` + e
      );
    }
  }
}
