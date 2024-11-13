
import { DTORequest, StatusDTO } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: DTORequest<StatusDTO>): Promise<TweeterResponse> => {
    const statusService = new StatusService();
    await statusService.postStatus(request.token, request.dto);
    return {
        success: true,
        message: null,
    }
}