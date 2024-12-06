import { Status, StatusDTO, UserDTO } from "tweeter-shared";
import { DatabaseFactory } from "../dao/DatabaseFactory";

export class StatusService {

  private feedsDAO;
  private storiesDAO;
  private authsDAO;
  private usersDAO;
  private followsDAO;
  private profileImageDAO;

  public constructor(dbfactory: DatabaseFactory) {
    this.feedsDAO = dbfactory.createFeedsDAO();
    this.storiesDAO = dbfactory.createStoriesDAO();
    this.authsDAO = dbfactory.createAuthsDAO();
    this.usersDAO = dbfactory.createUsersDAO();
    this.followsDAO = dbfactory.createFollowsDAO();
    this.profileImageDAO = dbfactory.createProfileImageDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.validateToken(token);
    const [statuses, hasMorePages] = await this.feedsDAO.getFeedItems(userAlias, pageSize, lastItem);
    const statusDTOs = await this.packageUsersToStatusDTOs(statuses);
    return [statusDTOs, hasMorePages];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.validateToken(token);
    const [statuses, hasMorePages] = await this.storiesDAO.getStoryItems(userAlias, pageSize, lastItem);
    const statusDTOs = await this.packageUsersToStatusDTOs(statuses);
    return [statusDTOs, hasMorePages];
  }

  public async postStatus(
    token: string,
    newStatus: StatusDTO
  ): Promise<void> {
    await this.validateToken(token);
    await this.storiesDAO.postStoryItem(newStatus);
    await this.addStatusToFeeds(newStatus);
  }

  private async validateToken(token: string): Promise<void> {
    const authToken = await this.authsDAO.getAuth(token);
    if (!authToken) {
      throw new Error("[Bad Request]: Invalid token");
    }
  }

  private async packageUsersToStatusDTOs(statuses: StatusDTO[]): Promise<StatusDTO[]> {
    const packagedDTOs: StatusDTO[] = [];
    for (const status of statuses) {
      const user = await this.usersDAO.getUserByAlias(status.user.alias);
      if (user) {
        const imageUrl = this.profileImageDAO.getImageUrl(user.imageUrl);
        packagedDTOs.push({
          user: {
            alias: user.alias,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: imageUrl
          },
          post: status.post,
          timestamp: status.timestamp
        });
      }
    }
    return packagedDTOs;
  }

  private async addStatusToFeeds(newStatus: StatusDTO): Promise<void> {
    var lastFollower = undefined;
    do {
      var [followers, hasMore] = await this.followsDAO.getFollowers(newStatus.user.alias, 50, lastFollower);
      for (const follower of followers) {
        await this.feedsDAO.addFeedItem(follower, newStatus);
      }
      if (hasMore) {
        lastFollower = followers[followers.length - 1];
      }
    } while (hasMore);
  }

}
