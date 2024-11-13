
import { DTORequest, UserDTO } from "tweeter-shared";
import { CountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: DTORequest<UserDTO>): Promise<CountResponse> => {  
    const followService = new FollowService();
    const followeeCount = await followService.getFolloweeCount(request.token, request.dto);
    return { 
        success: true,
        message: null,
        count: followeeCount
    };
}