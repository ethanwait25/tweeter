
import { RegisterRequest } from "tweeter-shared";
import { UserTokenResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/dao/dynamodb/DynamoFactory";

export const handler = async (request: RegisterRequest): Promise<UserTokenResponse> => {
    const userService = new UserService(new DynamoFactory());
    const [user, token] = await userService.register(request.firstName, request.lastName, request.alias, 
        request.password, request.userImageBytes, request.imageFileExtension);
    return {
        success: true,
        message: null,
        user: user,
        authToken: token
    }
}