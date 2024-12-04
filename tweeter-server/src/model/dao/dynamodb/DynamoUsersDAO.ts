import { User } from "tweeter-shared";
import { UsersDAO } from "../UsersDAO";

export class DynamoStoriesDAO implements UsersDAO {
    createUser(firstName: string, lastName: string, alias: string, password: string): Promise<User> {
        // Implementation here
        return Promise.resolve({} as User);
    }

    getUserByAlias(alias: string): Promise<User | null> {
        // Implementation here
        return Promise.resolve(null);
    }
}