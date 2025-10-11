export interface ContactCustomer {
	id: number;
	fullName: string;
	phoneCustomer: string;
	message: string | null;
	serviceId?: number | null;
	createdAt: string;
	service?: {
		id: number;
		title: string;
	};
	// Backward compatibility fields for existing code
	full_name?: string;
	phone_customer?: string;
	service_id?: number;
	created_at?: string;
	service_title?: string;
}

export interface ContactCustomerData {
	full_name: string;
	phone_customer: string;
	message: string;
	service_id?: number;
}

export interface ContactCustomerResponse {
	message: string;
	result: ContactCustomer;
}

export interface ContactCustomerListResponse {
	message: string;
	result: ContactCustomer[];
}

export interface ContactStats {
	total: number;
	thisMonth: number;
	thisWeek: number;
	today: number;
	byService: Array<{
		service_id: number;
		service_title: string;
		count: number;
	}>;
}
