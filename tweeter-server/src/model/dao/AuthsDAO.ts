import { AuthToken } from "tweeter-shared";

export interface AuthsDAO {
    getAuth(token: string): Promise<AuthToken | null>;
    createAuth(authToken: AuthToken, alias: string): Promise<void>;
    deleteAuth(token: string): Promise<void>;
    getAliasFromToken(token: string): Promise<string | null>;
}