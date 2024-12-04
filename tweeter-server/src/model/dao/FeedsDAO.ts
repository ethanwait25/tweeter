export interface FeedsDAO {
    getFeedItems(alias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]>;
}