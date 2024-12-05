import { AuthToken } from "tweeter-shared";

export interface AuthsDAO {
    getAuth(token: string): Promise<AuthToken>;
    createAuth(alias: string): Promise<AuthToken>;
    deleteAuth(token: string): Promise<void>;
    getAliasFromToken(token: string): Promise<string | null>;
}