import { fetchActivities } from "@/services/api/activitiesService"
import { backendActivities } from "@/types/api"
import { promises } from "dns"
import { create } from "zustand"

export interface activityType{
    userName: string
    userRole: string
    action: string
    id: string
    date: string
  }


type activitiesState = {
    activities: activityType[]
    isLoading: boolean
    error : string | null
    fetchAllActivities :() => Promise<void>
}
  

export const useActivitiesStore = create<activitiesState>((set) => ({
    activities: [],
    isLoading: false,
    error: null,
    fetchAllActivities: async () => {
    try {
        set({ isLoading: true, error: null })
        const response = await fetchActivities()

        if (response && response.data && response.data.data) {
            const formattedActivities: activityType[] = response.data.data.map((activity: backendActivities) => ({
                id: activity._id,
                userName: activity.userName,
                userRole: activity.userRole,
                date: activity.createdAt,
                action: activity.action
            }))
            set({activities: formattedActivities})
        }
    } catch (error) {
        set({ error: error instanceof Error ? error.message : "Failed to fetch activities." });
        console.error("Error fetching the activities", error)
    } finally {
        set({isLoading: false})
    }
}
}))