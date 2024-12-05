import { User } from "tweeter-shared";
import { UsersDAO } from "../UsersDAO";

export class DynamoUsersDAO implements UsersDAO {
    createUser(firstName: string, lastName: string, alias: string, password: string): Promise<User | null> {
        // Implementation here
        return Promise.resolve({} as User);
    }

    getUserWithCredentials(alias: string, password: string): Promise<User | null> {
        // Implementation here
        return Promise.resolve(null);
    }

    getUserByAlias(alias: string): Promise<User | null> {
        // Implementation here
        return Promise.resolve(null);
    }
}