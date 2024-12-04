import { FakeData, Status, StatusDTO } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  public async postStatus(
    token: string,
    newStatus: StatusDTO
  ): Promise<void> {
    // Pause so we can see posting message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }

  private async getFakeData(lastItem: StatusDTO | null, pageSize: number): Promise<[StatusDTO[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDTO(lastItem), pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

}
