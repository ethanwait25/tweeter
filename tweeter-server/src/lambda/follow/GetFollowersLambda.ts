
import { PagedItemRequest, UserDTO } from "tweeter-shared";
import { PagedItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: PagedItemRequest<UserDTO>): Promise<PagedItemResponse<UserDTO>> => {  
    const followService = new FollowService();
    const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
    return { 
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    };
}