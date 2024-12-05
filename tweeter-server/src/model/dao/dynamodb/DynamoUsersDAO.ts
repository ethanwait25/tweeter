import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { User } from "tweeter-shared";
import { UsersDAO } from "../UsersDAO";
import { DynamoDAO } from "./DynamoDAO";

const bcrypt = require("bcryptjs");

export class DynamoUsersDAO extends DynamoDAO implements UsersDAO {
  readonly tableName = "tweeter-users";
  readonly aliasAttrName = "alias";
  readonly firstNameAttrName = "firstName";
  readonly lastNameAttrName = "lastName";
  readonly passwordAttrName = "password";
  readonly imageUrlAttrName = "imageUrl";

  constructor() {
    super();
  }

  async createUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    profileExtension: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttrName]: alias,
        [this.passwordAttrName]: password,
        [this.firstNameAttrName]: firstName,
        [this.lastNameAttrName]: lastName,
        [this.imageUrlAttrName]: alias + "." + profileExtension,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`User ${alias} created successfully`);
    } catch (e) {
      console.error(`Could not create user ${alias}: ${e}`);
      throw new Error("Could not create user");
    }
  }

  async getUserWithCredentials(
    alias: string,
    password: string
  ): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttrName]: alias,
      },
    };

    try {
      const data = await this.client.send(new GetCommand(params));

      if (data.Item && bcrypt.compareSync(password, data.Item[this.passwordAttrName])) {
        return new User(
          data.Item[this.firstNameAttrName],
          data.Item[this.lastNameAttrName],
          data.Item[this.aliasAttrName],
          data.Item[this.imageUrlAttrName]
        );
      }
      console.error(`Could not find user ${alias}`);
      return null;
    } catch (e) {
      throw new Error("Could not find user:" + e);
    }
  }

  async getUserByAlias(alias: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttrName]: alias,
      },
    };

    try {
      const data = await this.client.send(new GetCommand(params));

      if (data.Item) {
        return new User(
          data.Item[this.firstNameAttrName],
          data.Item[this.lastNameAttrName],
          data.Item[this.aliasAttrName],
          data.Item[this.imageUrlAttrName]
        );
      }
      console.error(`Could not find user ${alias}`);
      return null;
    } catch (e) {
      throw new Error("Could not find user:" + e);
    }
  }
}
