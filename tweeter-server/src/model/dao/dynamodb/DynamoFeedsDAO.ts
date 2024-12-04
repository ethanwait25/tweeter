import { FeedsDAO } from "../FeedsDAO";

export class DynamoFeedsDAO implements FeedsDAO {
    getFeedItems(alias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
        // Implementation here
        return Promise.resolve([[], false]);
    }
}