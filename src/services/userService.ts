import api from './api';
import type { User, ApiResponse, PaginatedResponse } from '../interfaces';

export const userService = {
	// Get all users
	getUsers: async (
		page: number = 1,
		limit: number = 10,
	): Promise<PaginatedResponse<User>> => {
		const response = await api.get(`/users?page=${page}&limit=${limit}`);
		return response.data;
	},

	// Get user by ID
	getUserById: async (id: string): Promise<ApiResponse<User>> => {
		const response = await api.get(`/users/${id}`);
		return response.data;
	},

	// Create new user
	createUser: async (
		userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<ApiResponse<User>> => {
		const response = await api.post('/users', userData);
		return response.data;
	},

	// Update user
	updateUser: async (
		id: string,
		userData: Partial<User>,
	): Promise<ApiResponse<User>> => {
		const response = await api.put(`/users/${id}`, userData);
		return response.data;
	},

	// Delete user
	deleteUser: async (id: string): Promise<ApiResponse<null>> => {
		const response = await api.delete(`/users/${id}`);
		return response.data;
	},
};
