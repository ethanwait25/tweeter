import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setPost: (post: string) => void;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setIsLoading: (loading: boolean) => void;
}

export class PostStatusPresenter {
  private postStatusView: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this.statusService = new StatusService();
    this.postStatusView = view;
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    event.preventDefault();

    try {
      this.postStatusView.setIsLoading(true);
      this.postStatusView.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.postStatusView.setPost("");
      this.postStatusView.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.postStatusView.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.postStatusView.clearLastInfoMessage();
      this.postStatusView.setIsLoading(false);
    }
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.postStatusView.setPost("");
  };
}
