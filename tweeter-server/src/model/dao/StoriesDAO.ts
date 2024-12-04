export interface StoriesDAO {
    getStoryItems(alias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]>;
    postStoryItem(alias: string, newStory: string): Promise<void>;
}