export interface StarCustomer {
	id: number;
	star: number;
	name_customer: string;
	content?: string;
	created_at: string;
	updated_at: string;
}

export interface CreateStarCustomerPayload {
	star: number;
	name_customer: string;
	content?: string;
}

export interface StarCustomerStats {
	total: number;
	averageRating: number;
	distribution: {
		'5': number;
		'4': number;
		'3': number;
		'2': number;
		'1': number;
	};
}
