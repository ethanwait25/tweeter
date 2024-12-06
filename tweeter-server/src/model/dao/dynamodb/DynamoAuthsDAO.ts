import {
  DeleteCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { AuthToken } from "tweeter-shared";
import { AuthsDAO } from "../AuthsDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoAuthsDAO extends DynamoDAO implements AuthsDAO {
  readonly tableName = "tweeter-auths";
  readonly tokenAttrName = "token";
  readonly timestampAttrName = "timestamp";
  readonly aliasAttrName = "alias";

  constructor() {
    super();
  }

  async getAuth(token: string): Promise<AuthToken | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttrName]: token,
      },
    };

    try {
      const data = await this.client.send(new GetCommand(params));

      if (data.Item) {

        if (!this.checkIsLivingToken(data.Item[this.timestampAttrName])) {
            console.error(`Token ${token} is expired`);
            await this.deleteAuth(token);
            return null;
        }

        return new AuthToken(
          data.Item[this.tokenAttrName],
          data.Item[this.timestampAttrName]
        );
      }
      console.error(`Could not find token ${token}`);
      return null;
    } catch (e) {
      throw new Error("Error in finding token:" + e);
    }
  }

  async createAuth(authToken: AuthToken, alias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.tokenAttrName]: authToken.token,
        [this.timestampAttrName]: authToken.timestamp,
        [this.aliasAttrName]: alias,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Token ${authToken.token} created successfully`);
    } catch (e) {
      console.error(`Could not create token ${authToken.token}: ${e}`);
      throw new Error("Error in creating authToken:" + e);
    }
  }

  async deleteAuth(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttrName]: token,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
    } catch (e) {
      throw new Error("Error in deleting token:" + e);
    }
  }

  async getAliasFromToken(token: string): Promise<string | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttrName]: token,
      },
    };

    try {
      const data = await this.client.send(new GetCommand(params));

      if (data.Item) {

        if (!this.checkIsLivingToken(data.Item[this.timestampAttrName])) {
            console.error(`Token ${token} is expired`);
            await this.deleteAuth(token);
            return null;
        }

        return data.Item[this.aliasAttrName];
      }
      console.error(`Could not find token ${token}`);
      return null;
    } catch (e) {
      throw new Error("Error in finding token:" + e);
    }
  }

  private checkIsLivingToken(timestamp: number) {
    const now = new Date().getTime();
    const tokenTime = new Date(timestamp).getTime();
    return now - tokenTime < 1000 * 60 * 60 * 24;
  }
}
