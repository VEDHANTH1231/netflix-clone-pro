import { api } from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, UserProfileResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserProfileResponse> => {
    const response = await api.get<UserProfileResponse>('/auth/me');
    return response.data;
  },
};
export default authService;
