import { AuthToken } from "tweeter-shared";
import { AuthsDAO } from "../AuthsDAO";

export class DynamoAuthsDAO implements AuthsDAO {
    getAuth(token: string): Promise<AuthToken> {
        // Implementation here
        return Promise.resolve({} as AuthToken); 
    }

    createAuth(alias: string): Promise<AuthToken> {
        // Implementation here
        return Promise.resolve({} as AuthToken);
    }

    deleteAuth(token: string): Promise<void> {
        // Implementation here
        return Promise.resolve();
    }

    getAliasFromToken(token: string): Promise<string | null> {
        // Implementation here
        return Promise.resolve("alias");
    }
}