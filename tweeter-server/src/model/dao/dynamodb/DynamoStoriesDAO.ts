import { StoriesDAO } from "../StoriesDAO";

export class DynamoStoriesDAO implements StoriesDAO {
    getStoryItems(alias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
        // Implementation here
        return Promise.resolve([[], false]);
    }

    postStoryItem(alias: string, newStory: string): Promise<void> {
        // Implementation here
        return Promise.resolve();
    }
}