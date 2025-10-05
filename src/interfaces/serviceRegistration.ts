export interface ServiceRegistration {
	id: string;
	customer_name: string;
	phone: string;
	address?: string;
	notes?: string;
	registration_date: string; // ISO date string
	duration_months: number;
	end_date: string; // ISO date string
	status: 'active' | 'expired' | 'cancelled';
	created_at: string;
	updated_at: string;
}

export interface CreateServiceRegistrationRequest {
	customer_name: string;
	phone: string;
	address?: string;
	notes?: string;
	duration_months: number;
}

export interface UpdateServiceRegistrationRequest {
	customer_name?: string;
	phone?: string;
	address?: string;
	notes?: string;
	duration_months?: number;
	status?: 'active' | 'expired' | 'cancelled';
}

export interface ServiceRegistrationFilter {
	status?: string;
	expiring_in_days?: number;
	start_date?: string;
	end_date?: string;
	page?: number;
	limit?: number;
}

export interface ServiceRegistrationListResponse {
	success: boolean;
	message: string;
	data: {
		data: ServiceRegistration[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface ServiceRegistrationResponse {
	success: boolean;
	message: string;
	data: ServiceRegistration;
}

export interface ServiceRegistrationStats {
	total: number;
	active: number;
	expired: number;
	cancelled: number;
	expiring_soon: number;
}

export interface ServiceRegistrationStatsResponse {
	success: boolean;
	message: string;
	data: ServiceRegistrationStats;
}
