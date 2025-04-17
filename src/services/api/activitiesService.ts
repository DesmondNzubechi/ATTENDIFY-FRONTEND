import { ApiResponse, backendActivities } from "@/types/api"
import { apiClient } from "./apiClient"


export const fetchActivities = async () => {
    return await apiClient("/api/v1/activities/fetchAllActivities") as ApiResponse<backendActivities>
}