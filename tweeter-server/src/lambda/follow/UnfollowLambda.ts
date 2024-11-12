
import { UserTokenRequest } from "tweeter-shared";
import { CountsResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: UserTokenRequest): Promise<CountsResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.unfollow(request.token, request.user);
    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}