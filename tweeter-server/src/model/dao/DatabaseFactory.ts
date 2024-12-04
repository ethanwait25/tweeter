import { AuthsDAO } from "./AuthsDAO";
import { FeedsDAO } from "./FeedsDAO";
import { FollowsDAO } from "./FollowsDAO";
import { StoriesDAO } from "./StoriesDAO";
import { UsersDAO } from "./UsersDAO";

export interface DatabaseFactory {
    createAuthsDAO(): AuthsDAO;
    createFeedsDAO(): FeedsDAO;
    createFollowsDAO(): FollowsDAO;
    createStoriesDAO(): StoriesDAO;
    createUsersDAO(): UsersDAO;
}