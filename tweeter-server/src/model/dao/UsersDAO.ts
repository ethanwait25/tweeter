import { User } from "tweeter-shared";

export interface UsersDAO {
    createUser(firstName: string, lastName: string, alias: string, password: string, profileExtension: string): Promise<void>;
    getUserWithCredentials(alias: string, password: string): Promise<User | null>;
    getUserByAlias(alias: string): Promise<User | null>;
}