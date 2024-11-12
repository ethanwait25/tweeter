import { TweeterResponse } from "./TweeterResponse";

export interface CountsResponse extends TweeterResponse {
    readonly followerCount: number;
    readonly followeeCount: number;
}