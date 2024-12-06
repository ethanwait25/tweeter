import { UserDTO } from "tweeter-shared";

export interface FollowsDAO {
    getFollowers(alias: string, pageSize: number, lastFollowerAlias?: string): Promise<[string[], boolean]>;
    getFollowees(alias: string, pageSize: number, lastFolloweeAlias?: string): Promise<[string[], boolean]>;
    isFollower(userAlias: string, selectedUserAlias: string): Promise<boolean>;
    getFollowerCount(alias: string): Promise<number>;
    getFolloweeCount(alias: string): Promise<number>;
    addFollow(userAlias: string, followAlias: string): Promise<void>;
    removeFollow(userAlias: string, followAlias: string): Promise<void>;
}