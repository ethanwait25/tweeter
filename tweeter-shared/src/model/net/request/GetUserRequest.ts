import { TokenRequest } from "./TokenRequest";

export interface GetUserRequest extends TokenRequest {
    readonly alias: string
}