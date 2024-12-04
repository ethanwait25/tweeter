import { AuthsDAO } from "../AuthsDAO";

export class DynamoAuthsDAO implements AuthsDAO {
    verifyAuth(alias: string, password: string): Promise<boolean> {
        // Implementation here
        return Promise.resolve(true);    
    }

    getAliasFromToken(token: string): Promise<string | null> {
        // Implementation here
        return Promise.resolve("alias");
    }
}