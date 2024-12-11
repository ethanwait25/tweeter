import {
  BatchWriteCommand,
  BatchWriteCommandInput,
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

  async addStatusToFeeds(followers: string[], status: StatusDTO): Promise<void> {
    const MAX_ITEMS = 25;
  
    const batches = [];
    for (let i = 0; i < followers.length; i += MAX_ITEMS) {
      batches.push(followers.slice(i, i + MAX_ITEMS));
    }
  
    for (const batch of batches) {
      const params: BatchWriteCommandInput = {
        RequestItems: {
          [this.tableName]: followers.map(follower => ({
            PutRequest: {
              Item: {
                [this.aliasAttrName]: follower,
                [this.timestampAttrName]: status.timestamp,
                [this.postAttrName]: status.post,
                [this.authorAttrName]: status.user.alias,
              },
            },
          })),
        },
      };
  
      try {
        const command = new BatchWriteCommand(params);
        const result = await this.client.send(command);

        let unprocessedItems = result.UnprocessedItems;
  
        while (unprocessedItems && Object.keys(unprocessedItems).length > 0) {
          const retryCommand = new BatchWriteCommand({ RequestItems: unprocessedItems });
          const retryResult = await this.client.send(retryCommand);
          unprocessedItems = retryResult.UnprocessedItems;
        }
  
        console.log(`Successfully wrote status to follower batch of size ${batch.length}.`);
      } catch (error) {
        console.error('Error writing batch:', error);
      }
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
