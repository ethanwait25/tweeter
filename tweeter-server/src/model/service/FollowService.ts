import { UserDTO } from "tweeter-shared";
import { DatabaseFactory } from "../dao/DatabaseFactory";

export class FollowService {

  private followsDAO;
  private authsDAO;

  public constructor(dbfactory: DatabaseFactory) {
    this.followsDAO = dbfactory.createFollowsDAO();
    this.authsDAO = dbfactory.createAuthsDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    await this.validateToken(token);
    return await this.followsDAO.getFollowers(userAlias, pageSize, lastItem?.alias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    await this.validateToken(token);
    return await this.followsDAO.getFollowees(userAlias, pageSize, lastItem?.alias);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean> {
    await this.validateToken(token);
    return await this.followsDAO.isFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(
    token: string,
    user: UserDTO
  ): Promise<number> {
    await this.validateToken(token);
    return await this.followsDAO.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    token: string,
    user: UserDTO
  ): Promise<number> {
    await this.validateToken(token);
    return await this.followsDAO.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.validateToken(token);

    const userAlias = await this.authsDAO.getAliasFromToken(token);
    if (!userAlias) {
      throw new Error("No user found for token");
    }

    await this.followsDAO.addFollow(userAlias, userToFollow.alias);

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.validateToken(token);

    const userAlias = await this.authsDAO.getAliasFromToken(token);
    if (!userAlias) {
      throw new Error("No user found for token");
    }

    await this.followsDAO.removeFollow(userAlias, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  private async validateToken(token: string): Promise<void> {
    const authToken = await this.authsDAO.getAuth(token);
    if (!authToken) {
      throw new Error("Invalid token");
    }
  }
}
