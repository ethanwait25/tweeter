import { StatusDTO } from "tweeter-shared";
import { StoriesDAO } from "../StoriesDAO";

export class DynamoStoriesDAO implements StoriesDAO {
    getStoryItems(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]> {
        // Implementation here
        return Promise.resolve([[], false]);
    }

    postStoryItem(story: StatusDTO): Promise<void> {
        // Implementation here
        return Promise.resolve();
    }
}