
import { apiClient } from "./apiClient";
import { ApiResponse, BackendCourse } from "@/types/api";

export type Course = {
  id: string;
  courseName: string;
  courseCode: string;
  description: string;
  level?: string;
  semester?: string;
};

export const coursesService = {
  getAllCourses: async (): Promise<ApiResponse<BackendCourse>> => {
    return await apiClient("/api/v1/course/fetchAllCourse");
  },
  
  getCoursesByLevel: async (level: string): Promise<ApiResponse<BackendCourse>> => {
    return await apiClient(`/api/v1/course/fetchCoursesByLevel/${level}`);
  },
  
  getCoursesBySemester: async (semester: string): Promise<ApiResponse<BackendCourse>> => {
    return await apiClient(`/api/v1/course/fetchCoursesBySemester/${semester}`);
  },
   
  addCourse: async (courseData: Omit<Course, "id">): Promise<ApiResponse<BackendCourse>> => {
    return await apiClient("/api/v1/course/addANewCourse", {
      method: "POST",
      body: courseData
    });
  },
  
  deleteCourse: async (id: string): Promise<ApiResponse<any>> => {
    return await apiClient(`/api/v1/course/deleteACourse/${id}`, {
      method: "DELETE"
    });
  },
  
  deleteAllCourses: async (): Promise<ApiResponse<any>> => {
    return await apiClient("/api/v1/course/deleteAllCourses", {
      method: "DELETE"
    });
  }
};
