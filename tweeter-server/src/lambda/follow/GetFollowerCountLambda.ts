
import { DTORequest, StatusDTO, UserDTO } from "tweeter-shared";
import { CountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";

export const handler = async (request: DTORequest<UserDTO>): Promise<CountResponse> => {  
    const followService = new FollowService(new DynamoFactory());
    const followerCount = await followService.getFollowerCount(request.token, request.dto);
    return { 
        success: true,
        message: null,
        count: followerCount
    };
}