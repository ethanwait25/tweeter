import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { mock, instance, verify, spy, when, anything, capture } from "ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter : PostStatusPresenter;
    let mockStatusService: StatusService;

    const post = "post";
    const authToken = new AuthToken("token", Date.now());
    const user = new User("first", "last", "alias", "url");

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const spyPostStatusPresenter = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(spyPostStatusPresenter);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);
        when(spyPostStatusPresenter.statusService).thenReturn(mockStatusServiceInstance);
    });

    test("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(post, user, authToken);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    });

    test("calls postStatus on the status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(post, user, authToken);
        verify(mockStatusService.postStatus(authToken, anything())).once();

        const [capturedAuth, capturedStatus] = capture(mockStatusService.postStatus).last();
        expect(capturedStatus.post).toBe(post);
    });

    test("if the post succeeds, tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
        await postStatusPresenter.submitPost(post, user, authToken);
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusView.displayErrorMessage(anything())).never();
    });

    test("if the post fails, reports error and clears last message and does not clear post or display a status posed message", async () => {
        const error = new Error("An error occurred");
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

        await postStatusPresenter.submitPost(post, user, authToken);
        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.setPost("")).never();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
    });
});