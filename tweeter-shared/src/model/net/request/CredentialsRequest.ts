import { TweeterRequest } from "./TweeterRequest";

export interface CredentialsRequest extends TweeterRequest {
    readonly alias: string,
    readonly password: string
}