
import { FollowerStatusRequest } from "tweeter-shared";
import { FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";

export const handler = async (request: FollowerStatusRequest): Promise<FollowerStatusResponse> => {  
    const followService = new FollowService(new DynamoFactory());
    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);
    return { 
        success: true,
        message: null,
        isFollower: isFollower
    };
}