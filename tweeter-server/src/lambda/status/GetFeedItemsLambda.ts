
import { PagedItemRequest, StatusDTO } from "tweeter-shared";
import { PagedItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";

export const handler = async (request: PagedItemRequest<StatusDTO>): Promise<PagedItemResponse<StatusDTO>> => {
    const statusService = new StatusService(new DynamoFactory());
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}