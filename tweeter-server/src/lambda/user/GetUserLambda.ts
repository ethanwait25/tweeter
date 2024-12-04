
import { GetUserRequest } from "tweeter-shared";
import { GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService(new DynamoFactory());
    const user = await userService.getUser(request.token, request.alias);
    return {
        success: true,
        message: null,
        user: user
    }
}