import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { FollowsDAO } from "../FollowsDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFollowsDAO extends DynamoDAO implements FollowsDAO {
  readonly tableName = "tweeter-follows";
  readonly userTable = "tweeter-users";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeHandleAttr = "followee_handle";
  readonly followerCountAttr = "followers";
  readonly followeeCountAttr = "followees";
  readonly aliasAttr = "alias";

  constructor() {
    super();
  }

  async getFollowers(
    alias: string,
    pageSize: number,
    lastFollowerAlias?: string
  ): Promise<[string[], boolean]> {
    const params = {
      IndexName: this.indexName,
      KeyConditionExpression: this.followeeHandleAttr + " = :followee_handle",
      ExpressionAttributeValues: {
        ":followee_handle": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerAlias === undefined
          ? undefined
          : {
              [this.followeeHandleAttr]: alias,
              [this.followerHandleAttr]: lastFollowerAlias,
            },
    };

    const items: string[] = [];
    try {
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
        items.push(item[this.followerHandleAttr]);
      });
      return [items, hasMorePages];
    } catch (e) {
      throw new Error(
        `[Server Error]: Could not get followers for user ${alias}: ` + e
      );
    }
  }

  async getFollowees(
    alias: string,
    pageSize: number,
    lastFolloweeAlias?: string
  ): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :follower_handle",
      ExpressionAttributeValues: {
        ":follower_handle": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeAlias === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: alias,
              [this.followeeHandleAttr]: lastFolloweeAlias,
            },
    };

    const items: string[] = [];
    try {
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
        items.push(item[this.followeeHandleAttr]);
      });
      return [items, hasMorePages];
    } catch (e) {
      throw new Error(
        `[Server Error]: Could not get followees for user ${alias}: ` + e
      );
    }
  }

  async isFollower(
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followeeHandleAttr]: selectedUserAlias,
        [this.followerHandleAttr]: userAlias,
      },
    };

    try {
      const data = await this.client.send(new GetCommand(params));
      return !!data.Item;
    } catch (e) {
      throw new Error(
        `[Server Error]: Could not check if user ${userAlias} is following user ${selectedUserAlias}: ` +
          e
      );
    }
  }

  async getFollowerCount(alias: string): Promise<number> {
    const params = {
      TableName: this.userTable,
      Key: {
        [this.aliasAttr]: alias,
      },
    };

    try {
      const data = await this.client.send(new GetCommand(params));

      if (data.Item) {
        return data.Item[this.followerCountAttr];
      }
      console.error(`Could not find user ${alias}`);
      return 0;
    } catch (e) {
      throw new Error(`[Server Error]: Could not find user ${alias}:` + e);
    }
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const params = {
      TableName: this.userTable,
      Key: {
        [this.aliasAttr]: alias,
      },
    };

    try {
      const data = await this.client.send(new GetCommand(params));

      if (data.Item) {
        return data.Item[this.followeeCountAttr];
      }
      console.error(`Could not find user ${alias}`);
      return 0;
    } catch (e) {
      throw new Error(`[Server Error]: Could not find user ${alias}:` + e);
    }
  }

  async addFollow(userAlias: string, followAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followeeHandleAttr]: followAlias,
        [this.followerHandleAttr]: userAlias,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      await this.updateCount(userAlias, this.followeeCountAttr, 1);
      await this.updateCount(followAlias, this.followerCountAttr, 1);
    } catch (e) {
      throw new Error(`[Server Error]: Could not add follow: ` + e);
    }
  }

  async removeFollow(userAlias: string, followAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followeeHandleAttr]: followAlias,
        [this.followerHandleAttr]: userAlias,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
      await this.updateCount(userAlias, this.followeeCountAttr, -1);
      await this.updateCount(followAlias, this.followerCountAttr, -1);
    } catch (e) {
      throw new Error(`[Server Error]: Could not remove follow: ` + e);
    }
  }

  private async updateCount(
    userAlias: string,
    type: string,
    value: number
  ): Promise<void> {
    const params = {
      TableName: this.userTable,
      Key: {
        [this.aliasAttr]: userAlias,
      },
      UpdateExpression: "ADD #type :incrementValue",
      ExpressionAttributeNames: {
        "#type": type,
      },
      ExpressionAttributeValues: {
        ":incrementValue": value,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }
}
