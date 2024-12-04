import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let service: StatusService;

  beforeEach(() => {
    service = new StatusService();
  });

  test("get story pages", async () => {
    let more = true;
    let last: Status | null = null;

    do {
      let authToken = new AuthToken("auth", 1000);
      let userAlias = "alias";
      let pageSize = 10;
      let lastItem: Status | null = last;

      const [items, hasMore]: [Status[], boolean] =
        await service.loadMoreStoryItems(
          authToken,
          userAlias,
          pageSize,
          lastItem
        );

      expect(items[0].user.firstName).toEqual(expect.any(String));

      more = hasMore;
      last = items[items.length - 1];
    } while (more);
  });
});
