import { StatusDTO } from "tweeter-shared";

export interface StoriesDAO {
    getStoryItems(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]>;
    postStoryItem(story: StatusDTO): Promise<void>;
}