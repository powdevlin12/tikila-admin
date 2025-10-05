export interface DashboardStatistics {
	id: number;
	totalContacts: number;
	totalProducts: number;
	totalReviews: number;
	totalRegistrations: number;
	totalUsers: number;
	activeRegistrations: number;
	expiredRegistrations: number;
	averageRating: number;
	newContactsThisMonth: number;
	newRegistrationsThisMonth: number;
	createdAt: string;
	updatedAt: string;
}

export interface RecentContact {
	id: number;
	fullName: string;
	phoneCustomer: string;
	message?: string;
	serviceId?: number;
	createdAt: string;
	service?: {
		id: number;
		title: string;
	};
}

export interface RecentRegistration {
	id: string;
	customer_name: string;
	phone: string;
	address?: string;
	notes?: string;
	registrationDate: string;
	duration_months: number;
	end_date: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface TopRatedReview {
	id: number;
	star: number;
	nameCustomer: string;
	content?: string;
	createdAt: string;
	updatedAt: string;
}

export interface RegistrationByStatus {
	status: string;
	count: number;
}

export interface DetailedDashboardData {
	statistics: DashboardStatistics;
	recentContacts: RecentContact[];
	recentRegistrations: RecentRegistration[];
	topRatedReviews: TopRatedReview[];
	registrationsByStatus: RegistrationByStatus[];
}

export interface DashboardResponse {
	message: string;
	result: DashboardStatistics;
}

export interface DetailedDashboardResponse {
	message: string;
	data: DetailedDashboardData;
}
