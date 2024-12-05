import { StatusDTO } from "tweeter-shared";
import { FeedsDAO } from "../FeedsDAO";

export class DynamoFeedsDAO implements FeedsDAO {
    getFeedItems(alias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]> {
        // Implementation here
        return Promise.resolve([[], false]);
    }
}