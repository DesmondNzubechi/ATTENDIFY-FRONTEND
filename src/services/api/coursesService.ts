
import { apiClient } from "./apiClient";

export interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  description: string;
  level?: string;
  semester?: string;
}

export const coursesService = {
  getAllCourses: async () => {
    return await apiClient("/api/v1/course/fetchAllCourse");
  },
  
  getCoursesByLevel: async (level: string) => {
    return await apiClient(`/api/v1/course/fetchCoursesByLevel/${level}`);
  },
  
  getCoursesBySemester: async (semester: string) => {
    return await apiClient(`/api/v1/course/fetchCoursesBySemester/${semester}`);
  },
  
  addCourse: async (courseData: Omit<Course, "id">) => {
    return await apiClient("/api/v1/course/addANewCourse", {
      method: "POST",
      body: courseData
    });
  },
  
  deleteCourse: async (id: string) => {
    return await apiClient(`/api/v1/course/deleteACourse/${id}`, {
      method: "DELETE"
    });
  },
  
  deleteAllCourses: async () => {
    return await apiClient("/api/v1/course/deleteAllCourses", {
      method: "DELETE"
    });
  }
};
