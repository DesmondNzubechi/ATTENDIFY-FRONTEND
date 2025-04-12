
import { apiClient } from "./apiClient";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  course: string;
  avatar?: string;
  level?: string;
  yearOfAdmission?: string;
}

export const studentsService = {
  getAllStudents: async () => {
    return await apiClient("/api/v1/student/fetchAllTheStudents");
  },
  
  getStudentById: async (id: string) => {
    return await apiClient(`/api/v1/student/fetchStudentByID/${id}`);
  },
  
  getStudentsByLevel: async (level: string) => {
    return await apiClient(`/api/v1/student/fetchStudentByLevel?level=${level}`);
  },
  
  getStudentsByYearOfAdmission: async (year: string) => {
    return await apiClient(`/api/v1/student/fetchStudentByYearOfAdmission?year=${year}`);
  },
  
  createStudent: async (studentData: Omit<Student, "id">) => {
    return await apiClient("/api/v1/student/createStudent", {
      method: "POST",
      body: studentData
    });
  },
  
  updateStudent: async (studentData: Partial<Student>) => {
    return await apiClient("/api/v1/student/updateStudentData", {
      method: "PATCH",
      body: studentData
    });
  },
  
  deleteStudent: async (id: string) => {
    return await apiClient(`/api/v1/student/deleteAStudent/${id}`, {
      method: "DELETE"
    });
  },
  
  deleteAllStudents: async () => {
    return await apiClient("/api/v1/student/deleteAllTheStudent", {
      method: "DELETE"
    });
  }
};
