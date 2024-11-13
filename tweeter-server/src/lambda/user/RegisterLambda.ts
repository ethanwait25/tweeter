
import { RegisterRequest } from "tweeter-shared";
import { UserTokenResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<UserTokenResponse> => {
    const userService = new UserService();
    const [user, token] = await userService.register(request.firstName, request.lastName, request.alias, 
        request.password, request.userImageBytes, request.imageFileExtension);
    return {
        success: true,
        message: null,
        user: user,
        authToken: token
    }
}