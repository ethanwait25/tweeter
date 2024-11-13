
import { CredentialsRequest } from "tweeter-shared";
import { UserTokenResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: CredentialsRequest): Promise<UserTokenResponse> => {
    const userService = new UserService();
    const [user, token] = await userService.login(request.alias, request.password);
    return {
        success: true,
        message: null,
        user: user,
        authToken: token
    }
}