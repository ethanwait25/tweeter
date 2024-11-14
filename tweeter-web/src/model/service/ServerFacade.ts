import {
  PagedItemRequest,
  FollowerStatusRequest,
  DTORequest,
  PagedItemResponse,
  FollowerStatusResponse,
  CountResponse,
  User,
  UserDTO,
  TweeterResponse,
  CountsResponse,
  StatusDTO,
  Status,
  CredentialsRequest,
  UserTokenResponse,
  AuthToken,
  RegisterRequest,
  GetUserRequest,
  GetUserResponse,
  TokenRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { URL } from "../../../serverconfig.json";

export class ServerFacade {
  private SERVER_URL = URL;

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedItemRequest<UserDTO>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDTO>,
      PagedItemResponse<UserDTO>
    >(request, "/followee/list");
    return await this.returnUsersList(response, "followees");
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDTO>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDTO>,
      PagedItemResponse<UserDTO>
    >(request, "/follower/list");
    return await this.returnUsersList(response, "followers");
  }

  public async getIsFollowerStatus(
    request: FollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      FollowerStatusRequest,
      FollowerStatusResponse
    >(request, "/follower/status");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(request: DTORequest<UserDTO>): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      DTORequest<UserDTO>,
      CountResponse
    >(request, "/followee/count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFollowerCount(request: DTORequest<UserDTO>): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      DTORequest<UserDTO>,
      CountResponse
    >(request, "/follower/count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async follow(
    request: DTORequest<UserDTO>
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      DTORequest<UserDTO>,
      CountsResponse
    >(request, "/user/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async unfollow(
    request: DTORequest<UserDTO>
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      DTORequest<UserDTO>,
      CountsResponse
    >(request, "/user/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFeedItems(
    request: PagedItemRequest<StatusDTO>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDTO>,
      PagedItemResponse<StatusDTO>
    >(request, "/status/feedlist");
    return await this.returnStatusList(response, "feed");
  }

  public async getMoreStoryItems(
    request: PagedItemRequest<StatusDTO>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDTO>,
      PagedItemResponse<StatusDTO>
    >(request, "/status/storylist");
    return await this.returnStatusList(response, "story");
  }

  public async postStatus(request: DTORequest<StatusDTO>): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      DTORequest<StatusDTO>,
      TweeterResponse
    >(request, "/status/create");

    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async login(request: CredentialsRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      CredentialsRequest,
      UserTokenResponse
    >(request, "/auth/login");

    if (response.success) {
      return [User.fromDTO(response.user) as User, AuthToken.fromDTO(response.authToken) as AuthToken]
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      UserTokenResponse
    >(request, "/auth/register");

    if (response.success) {
      return [User.fromDTO(response.user) as User, AuthToken.fromDTO(response.authToken) as AuthToken]
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/query");

    if (response.success) {
      return User.fromDTO(response.user) as User;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async logout(request: TokenRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      TokenRequest,
      TweeterResponse
    >(request, "/auth/logout");

    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  private async returnUsersList(
    response: PagedItemResponse<UserDTO>,
    target: string
  ): Promise<[User[], boolean]> {
    // Convert the UserDTO array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDTO(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${target} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  private async returnStatusList(
    response: PagedItemResponse<StatusDTO>,
    target: string
  ): Promise<[Status[], boolean]> {
    // Convert the StatusDTO array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDTO(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${target} items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
}
