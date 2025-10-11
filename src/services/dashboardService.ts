import apiClient from './api';
import type {
	DashboardResponse,
	DetailedDashboardResponse,
} from '../interfaces';

export const dashboardService = {
	// Get basic dashboard statistics
	getDashboardStats: async (): Promise<DashboardResponse> => {
		const response = await apiClient.get('/dashboard/stats');
		return response.data;
	},

	// Get detailed dashboard statistics with additional data
	getDetailedDashboardStats: async (): Promise<unknown> => {
		const response = await apiClient.get('/dashboard/detailed');
		return response;
	},

	// Refresh dashboard statistics (force recalculation)
	refreshDashboardStats: async (): Promise<DashboardResponse> => {
		const response = await apiClient.post('/dashboard/refresh');
		return response.data;
	},
};
