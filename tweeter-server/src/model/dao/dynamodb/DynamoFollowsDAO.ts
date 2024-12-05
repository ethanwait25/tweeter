import { UserDTO } from "tweeter-shared";
import { FollowsDAO } from "../FollowsDAO";

export class DynamoFollowsDAO implements FollowsDAO {
    getFollowers(alias: string, pageSize: number, lastFollowerAlias?: string): Promise<[UserDTO[], boolean]> {
        // Implementation here
        return Promise.resolve([]);
    }

    getFollowees(alias: string, pageSize: number, lastFolloweeAlias?: string): Promise<[UserDTO[], boolean]> {
        // Implementation here
        return Promise.resolve([]);
    }

    isFollower(userAlias: string, selectedUserAlias: string): Promise<boolean> {
        // Implementation here
        return Promise.resolve(false);
    }

    getFollowerCount(alias: string): Promise<number> {
        // Implementation here
        return Promise.resolve(0);
    }

    getFolloweeCount(alias: string): Promise<number> {
        // Implementation here
        return Promise.resolve(0);
    }

    addFollow(userAlias: string, followAlias: string): Promise<void> {
        // Implementation here
        return Promise.resolve();
    }

    removeFollow(userAlias: string, followAlias: string): Promise<void> {
        // Implementation here
        return Promise.resolve();
    }
}