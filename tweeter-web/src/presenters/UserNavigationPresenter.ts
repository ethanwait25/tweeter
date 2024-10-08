import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private userNavigationView: UserNavigationView;
  private userService: UserService;

  constructor(view: UserNavigationView) {
    this.userNavigationView = view;
    this.userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent, authToken: AuthToken | null, currentUser: User | null): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.userNavigationView.setDisplayedUser(currentUser!);
        } else {
          this.userNavigationView.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.userNavigationView.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
