export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	image_url?: string;
	status: 'active' | 'inactive';
	createdAt: string;
	updatedAt: string;
}

export interface ProductCreateRequest {
	name: string;
	description: string;
	price: number;
	image_url?: string;
}

export interface ProductUpdateRequest {
	name?: string;
	description?: string;
	price?: number;
	image_url?: string;
	status?: 'active' | 'inactive';
}

export interface ProductWithImage {
	name: string;
	description: string;
	price?: number;
	image: File;
	company_id?: number;
	detail_info?: string;
}
