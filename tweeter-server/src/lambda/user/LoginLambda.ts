
import { CredentialsRequest } from "tweeter-shared";
import { UserTokenResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";

export const handler = async (request: CredentialsRequest): Promise<UserTokenResponse> => {
    const userService = new UserService(new DynamoFactory());
    const [user, token] = await userService.login(request.alias, request.password);
    return {
        success: true,
        message: null,
        user: user,
        authToken: token
    }
}