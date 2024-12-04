
import { TokenRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";

export const handler = async (request: TokenRequest): Promise<TweeterResponse> => {
    const userService = new UserService(new DynamoFactory());
    await userService.logout(request.token);
    return {
        success: true,
        message: null
    }
}