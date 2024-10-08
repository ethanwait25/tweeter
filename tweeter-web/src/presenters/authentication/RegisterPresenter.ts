import { ChangeEvent } from "react";
import { UserService } from "../../model/service/UserService";
import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";

export interface RegisterView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
  navigate: (url: string) => void;
  setImageUrl: (url: string) => void;
  setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter {
  private userService: UserService;
  private registerView: RegisterView;

  private imageBytes: Uint8Array = new Uint8Array();
  private imageFileExtension: string = "";

  constructor(view: RegisterView) {
    this.registerView = view;
    this.userService = new UserService();
  }

  public async doRegister(firstName: string, lastName: string, alias: string, password: string, rememberMe: boolean) {
    try {
      this.registerView.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension
      );

      this.registerView.updateUserInfo(user, user, authToken, rememberMe);
      this.registerView.navigate("/");
    } catch (error) {
      this.registerView.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.registerView.setIsLoading(false);
    }
  }

  public handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  }

  private handleImageFile(file: File | undefined) {
    if (file) {
      this.registerView.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
        this.registerView.setImageFileExtension(fileExtension);
      }
    } else {
      this.registerView.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
