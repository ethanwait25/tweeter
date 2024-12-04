import { ServerFacade } from "../../src/model/service/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let facade: ServerFacade;

  beforeEach(() => {
    facade = new ServerFacade();
  });

  test("register", async () => {
    let request = {
      alias: "alias",
      password: "password",
      firstName: "name",
      lastName: "name",
      userImageBytes: "bytes",
      imageFileExtension: "file"
    };

    const [user, authToken] = await facade.register(request);

    expect(user.firstName).toBe("Allen");
    expect(user.alias).toBe("@allen");
    expect(authToken.timestamp).toBeDefined();
  });

  test("get followers", async () => {
    let request = {
      token: "token",
      userAlias: "alias",
      pageSize: 10,
      lastItem: null,
    };

    const [items, hasMore] = await facade.getMoreFollowers(request);

    expect(items[0].firstName).toBe("Allen");
    expect(hasMore).toBe(true);
  });

  test("get follower count", async () => {
    let request = {
      token: "token",
      dto: {
        firstName: "name",
        lastName: "name",
        alias: "alias",
        imageUrl: "url",
      },
    };

    const numFollowers = await facade.getFollowerCount(request);
    expect(numFollowers).toEqual(expect.any(Number));
  });
});
