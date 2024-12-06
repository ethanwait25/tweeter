import { AuthToken, UserDTO } from "tweeter-shared";
import { AuthTokenDTO } from "tweeter-shared/dist/model/dto/AuthTokenDTO";
import { DatabaseFactory } from "../dao/DatabaseFactory";

var bcrypt = require('bcryptjs');

export class UserService {

  private usersDAO;
  private authsDAO;
  private profileImageDAO;

  public constructor(dbfactory: DatabaseFactory) {
    this.usersDAO = dbfactory.createUsersDAO();
    this.authsDAO = dbfactory.createAuthsDAO();
    this.profileImageDAO = dbfactory.createProfileImageDAO();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    const user = await this.usersDAO.getUserWithCredentials(alias, password);

    if (user === null) {
      throw new Error("[Bad Request]: Invalid alias or password");
    }

    const imageUrl = this.profileImageDAO.getImageUrl(user.imageUrl);
    user.imageUrl = imageUrl;

    const authToken = AuthToken.Generate();
    await this.authsDAO.createAuth(authToken, alias);
    return [user.dto, authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    const existingUser = await this.usersDAO.getUserByAlias(alias);
    if (existingUser) {
      throw new Error("[Bad Request]: User already exists");
    }

    const hashedPassword = bcrypt.hashSync(password);
    await this.usersDAO.createUser(firstName, lastName, alias, hashedPassword, imageFileExtension);
    await this.profileImageDAO.uploadImage(alias, userImageBytes, imageFileExtension);

    const authToken = AuthToken.Generate();
    await this.authsDAO.createAuth(authToken, alias);
    const user = await this.usersDAO.getUserByAlias(alias);

    const imageUrl = this.profileImageDAO.getImageUrl(user!.imageUrl);
    user!.imageUrl = imageUrl;

    return [user!.dto, authToken.dto];
  }

  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDTO | null> {
    await this.validateToken(token);
    const dto = await this.usersDAO.getUserByAlias(alias);
    if (dto) {
      dto.imageUrl = this.profileImageDAO.getImageUrl(dto.imageUrl);
      return dto.dto;
    }
    return null;
  };

  public async logout(token: string): Promise<void> {
    await this.authsDAO.deleteAuth(token);
  };

  private async validateToken(token: string): Promise<void> {
    const authToken = await this.authsDAO.getAuth(token);
    if (!authToken) {
      throw new Error("[Bad Request]: Invalid token");
    }
  }
}
