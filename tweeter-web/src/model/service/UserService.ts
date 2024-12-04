import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { ServerFacade } from "./ServerFacade";

export class UserService {
  facade = new ServerFacade();

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const [ user, authToken ] = await this.facade.login({
      alias: alias,
      password: password
    });

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const [ user, authToken ] = await this.facade.register({
      alias: alias,
      password: password,
      firstName: firstName,
      lastName: lastName,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension
    });

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  }

  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.facade.getUser({
      token: authToken.token,
      alias: alias
    });
  };

  public async logout(authToken: AuthToken): Promise<void> {
    return this.facade.logout({
      token: authToken.token
    });
  };
}
