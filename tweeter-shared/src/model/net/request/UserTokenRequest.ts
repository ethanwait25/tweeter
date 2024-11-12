import { UserDTO } from "../../dto/UserDTO";

export interface UserTokenRequest {
    readonly token: string,
    readonly user: UserDTO,
}