import { CredentialsRequest } from "./CredentialsRequest";

export interface RegisterRequest extends CredentialsRequest {
    readonly firstName: string,
    readonly lastName: string,
    readonly userImageBytes: Uint8Array,
    readonly imageFileExtension: string
}