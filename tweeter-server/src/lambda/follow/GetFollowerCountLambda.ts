
import { UserTokenRequest } from "tweeter-shared";
import { CountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: UserTokenRequest): Promise<CountResponse> => {  
    const followService = new FollowService();
    const followerCount = await followService.getFollowerCount(request.token, request.user);
    return { 
        success: true,
        message: null,
        count: followerCount
    };
}