export interface Product {
	id: string;
	title: string; // Backend uses 'title' not 'name'
	description: string;
	price?: number;
	image_url?: string;
	detail_info?: string; // Rich text description
	is_delete: number; // Backend uses is_delete instead of status
	created_at: string; // Backend uses created_at
	updated_at?: string;
	company_id?: number;
}

export interface ProductCreateRequest {
	title: string; // Match backend field name
	description: string;
	detail_info?: string; // Rich text description
	price?: number;
	image_url?: string;
	company_id?: number;
}

export interface ProductUpdateRequest {
	title?: string; // Match backend field name
	description?: string;
	detail_info?: string; // Rich text description
	price?: number;
	image_url?: string;
	company_id?: number;
}

export interface ProductWithImage {
	title: string; // Match backend field name
	description: string;
	detail_info?: string; // Rich text description
	price?: number;
	image: File;
	company_id?: number;
}
