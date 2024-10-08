import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setIsLoading: (loading: boolean) => void;
}

export class UserInfoPresenter {
  private followService: FollowService;
  private userInfoView: UserInfoView;

  public constructor(view: UserInfoView) {
    this.followService = new FollowService;
    this.userInfoView = view;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.userInfoView.setIsFollower(false);
      } else {
        this.userInfoView.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this.userInfoView.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.userInfoView.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this.userInfoView.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.userInfoView.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this.userInfoView.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public switchToLoggedInUser(event: React.MouseEvent, currentUser: User): void {
    event.preventDefault();
    this.userInfoView.setDisplayedUser(currentUser!);
  }

  public async followDisplayedUser(event: React.MouseEvent, displayedUser: User, authToken: AuthToken): Promise<void> {
    event.preventDefault();

    try {
      this.userInfoView.setIsLoading(true);
      this.userInfoView.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        displayedUser!
      );

      this.userInfoView.setIsFollower(true);
      this.userInfoView.setFollowerCount(followerCount);
      this.userInfoView.setFolloweeCount(followeeCount);
    } catch (error) {
      this.userInfoView.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.userInfoView.clearLastInfoMessage();
      this.userInfoView.setIsLoading(false);
    }
  };

  public async unfollowDisplayedUser (event: React.MouseEvent, displayedUser: User, authToken: AuthToken): Promise<void> {
    event.preventDefault();

    try {
      this.userInfoView.setIsLoading(true);
      this.userInfoView.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken!,
        displayedUser!
      );

      this.userInfoView.setIsFollower(false);
      this.userInfoView.setFollowerCount(followerCount);
      this.userInfoView.setFolloweeCount(followeeCount);
    } catch (error) {
      this.userInfoView.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.userInfoView.clearLastInfoMessage();
      this.userInfoView.setIsLoading(false);
    }
  };
}
