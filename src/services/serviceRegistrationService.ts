import apiClient from './api';
import type {
	CreateServiceRegistrationRequest,
	UpdateServiceRegistrationRequest,
	ServiceRegistrationFilter,
	ServiceRegistrationListResponse,
	ServiceRegistrationResponse,
	ServiceRegistrationStatsResponse,
} from '../interfaces';

export class ServiceRegistrationService {
	// Get all service registrations with filters
	static async getServiceRegistrations(
		filters: ServiceRegistrationFilter = {},
	): Promise<ServiceRegistrationListResponse> {
		const params = new URLSearchParams();

		if (filters.status) params.append('status', filters.status);
		if (filters.expiring_in_days)
			params.append('expiring_in_days', filters.expiring_in_days.toString());
		if (filters.start_date) params.append('start_date', filters.start_date);
		if (filters.end_date) params.append('end_date', filters.end_date);
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.limit) params.append('limit', filters.limit.toString());

		const queryString = params.toString();
		const url = queryString
			? `/service-registrations?${queryString}`
			: '/service-registrations';

		const response = await apiClient.get<ServiceRegistrationListResponse>(url);
		return response.data;
	}

	// Get service registration by ID
	static async getServiceRegistrationById(
		id: string,
	): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.get<ServiceRegistrationResponse>(
			`/service-registrations/${id}`,
		);
		return response.data;
	}

	// Create new service registration
	static async createServiceRegistration(
		data: CreateServiceRegistrationRequest,
	): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.post<ServiceRegistrationResponse>(
			'/service-registrations',
			data,
		);
		return response.data;
	}

	// Update service registration
	static async updateServiceRegistration(
		id: string,
		data: UpdateServiceRegistrationRequest,
	): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.put<ServiceRegistrationResponse>(
			`/service-registrations/${id}`,
			data,
		);
		return response.data;
	}

	// Update service registration
	static async extendServiceRegistration(
		id: string,
		data: UpdateServiceRegistrationRequest,
	): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.put<ServiceRegistrationResponse>(
			`/service-registrations/extend/${id}`,
			data,
		);
		return response.data;
	}

	// Delete service registration (soft delete)
	static async deleteServiceRegistration(
		id: string,
	): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.delete<ServiceRegistrationResponse>(
			`/service-registrations/${id}`,
		);
		return response.data;
	}

	// Permanent delete service registration
	static async permanentDeleteServiceRegistration(
		id: string,
	): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.delete<ServiceRegistrationResponse>(
			`/service-registrations/${id}/permanent`,
		);
		return response.data;
	}

	// Get registrations expiring soon
	static async getExpiringSoon(
		days: number = 30,
	): Promise<ServiceRegistrationListResponse> {
		const response = await apiClient.get<ServiceRegistrationListResponse>(
			`/service-registrations/expiring/soon?days=${days}`,
		);
		return response.data;
	}

	// Get expired registrations
	static async getExpiredRegistrations(): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.get<ServiceRegistrationResponse>(
			'/service-registrations/expired/list',
		);
		return response.data;
	}

	// Update expired registrations status
	static async updateExpiredRegistrations(): Promise<ServiceRegistrationResponse> {
		const response = await apiClient.post<ServiceRegistrationResponse>(
			'/service-registrations/expired/update',
		);
		return response.data;
	}

	// Get statistics
	static async getStatistics(): Promise<ServiceRegistrationStatsResponse> {
		const response = await apiClient.get<ServiceRegistrationStatsResponse>(
			'/service-registrations/stats/overview',
		);
		return response.data;
	}

	// Helper method to format date for display
	static formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('vi-VN');
	}

	// Helper method to calculate days until expiration
	static calculateDaysUntilExpiration(endDate: string): number {
		const today = new Date();
		const expiry = new Date(endDate);
		const diffTime = expiry.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	// Helper method to get status color for UI
	static getStatusColor(status: string): string {
		switch (status) {
			case 'active':
				return 'green';
			case 'expired':
				return 'red';
			case 'cancelled':
				return 'orange';
			default:
				return 'default';
		}
	}

	// Helper method to get status label
	static getStatusLabel(status: string): string {
		switch (status) {
			case 'active':
				return 'Đang hoạt động';
			case 'expired':
				return 'Đã hết hạn';
			case 'cancelled':
				return 'Đã hủy';
			default:
				return status;
		}
	}

	// Helper method to check if registration is expiring soon
	static isExpiringSoon(endDate: string, daysThreshold: number = 30): boolean {
		const daysUntilExpiration = this.calculateDaysUntilExpiration(endDate);
		return daysUntilExpiration <= daysThreshold && daysUntilExpiration > 0;
	}
}
