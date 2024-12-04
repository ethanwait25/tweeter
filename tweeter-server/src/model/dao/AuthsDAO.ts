export interface AuthsDAO {
    verifyAuth(alias: string, password: string): Promise<boolean>;
    getAliasFromToken(token: string): Promise<string | null>;
}