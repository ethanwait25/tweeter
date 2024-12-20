import { DatabaseFactory } from "../DatabaseFactory";
import { S3ProfileImageDAO } from "./S3ProfileImageDAO";
import { DynamoAuthsDAO } from "./DynamoAuthsDAO";
import { DynamoFeedsDAO } from "./DynamoFeedsDAO";
import { DynamoFollowsDAO } from "./DynamoFollowsDAO";
import { DynamoStoriesDAO } from "./DynamoStoriesDAO";
import { DynamoUsersDAO } from "./DynamoUsersDAO";
import { SQSQueueDAO } from "./SQSQueueDAO";

export class DynamoFactory implements DatabaseFactory {
    createAuthsDAO(): DynamoAuthsDAO {
        return new DynamoAuthsDAO();
    }

    createFeedsDAO(): DynamoFeedsDAO {
        return new DynamoFeedsDAO();
    }

    createFollowsDAO(): DynamoFollowsDAO {
        return new DynamoFollowsDAO();
    }

    createStoriesDAO(): DynamoStoriesDAO {
        return new DynamoStoriesDAO();
    }

    createUsersDAO(): DynamoUsersDAO {
        return new DynamoUsersDAO();
    }

    createProfileImageDAO(): S3ProfileImageDAO {
        return new S3ProfileImageDAO();
    }

    createQueueDAO(): SQSQueueDAO {
        return new SQSQueueDAO();
    }
}