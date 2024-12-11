import { Status, StatusDTO } from "tweeter-shared";

export interface FeedsDAO {
    addStatusToFeeds(followers: string[], status: StatusDTO): Promise<void>
    getFeedItems(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]>;
}