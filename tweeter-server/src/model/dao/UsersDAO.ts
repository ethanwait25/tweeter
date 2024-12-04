import { User } from "tweeter-shared";

export interface UsersDAO {
    createUser(firstName: string, lastName: string, alias: string, password: string): Promise<User>;
    getUserByAlias(alias: string): Promise<User | null>;
}