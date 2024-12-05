import { StatusDTO } from "tweeter-shared";
import { DatabaseFactory } from "../dao/DatabaseFactory";

export class StatusService {

  private feedsDAO;
  private storiesDAO;
  private authsDAO;

  public constructor(dbfactory: DatabaseFactory) {
    this.feedsDAO = dbfactory.createFeedsDAO();
    this.storiesDAO = dbfactory.createStoriesDAO();
    this.authsDAO = dbfactory.createAuthsDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.validateToken(token);
    return await this.feedsDAO.getFeedItems(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.validateToken(token);
    return await this.storiesDAO.getStoryItems(userAlias, pageSize, lastItem);
  }

  public async postStatus(
    token: string,
    newStatus: StatusDTO
  ): Promise<void> {
    await this.validateToken(token);
    return await this.storiesDAO.postStoryItem(newStatus);
  }

  private async validateToken(token: string): Promise<void> {
    const authToken = await this.authsDAO.getAuth(token);
    if (!authToken) {
      throw new Error("Invalid token");
    }
  }

}
