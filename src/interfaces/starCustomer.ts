export interface StarCustomer {
	id: number;
	star: number;
	nameCustomer: string;
	content?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateStarCustomerPayload {
	star: number;
	nameCustomer: string;
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
