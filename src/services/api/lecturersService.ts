
import { apiClient } from './apiClient';
import { ApiResponse, BackendLecturer } from '@/types/api';
 
export const fetchLecturers = async () => {
  return await apiClient('/api/v1/lecturer/getAllLecturer') as ApiResponse<BackendLecturer>;
}; 
 
export const createLecturer = async (lecturerData: { fullName: string, email: string }) => {
  return await apiClient('/api/v1/lecturer/createLecturer', {
    method: 'POST',
    body: lecturerData
  }) as ApiResponse<BackendLecturer>;
};

export const updateLecturer = async (id: string, lecturerData: Partial<BackendLecturer>) => {
  return await apiClient(`/api/v1/lecturer/updateALecturer/${id}`, {
    method: 'PATCH',
    body: lecturerData
  }) as ApiResponse<BackendLecturer>;
};
  
export const deleteLecturer = async (id: string) => {
  return await apiClient(`/api/v1/lecturer/deleteALecturer/${id}`, {
    method: 'PATCH'
  }) as ApiResponse<BackendLecturer>;
};
