
import { DTORequest, UserDTO } from "tweeter-shared";
import { CountsResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: DTORequest<UserDTO>): Promise<CountsResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.follow(request.token, request.dto);
    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}