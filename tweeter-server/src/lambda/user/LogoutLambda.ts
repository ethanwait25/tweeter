
import { TokenRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: TokenRequest): Promise<TweeterResponse> => {
    const userService = new UserService();
    await userService.logout(request.token);
    return {
        success: true,
        message: null
    }
}