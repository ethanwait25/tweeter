import { StatusDTO } from "tweeter-shared";

export interface FeedsDAO {
    getFeedItems(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]>;
}