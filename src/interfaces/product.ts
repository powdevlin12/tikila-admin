export interface Product {
	id: number;
	title: string;
	description: string;
	imageUrl?: string;
	detailInfo?: string | null;
	isDelete: boolean;
	createdAt: string;
	companyId?: number | null;
	// Backward compatibility fields
	image_url?: string;
	detail_info?: string;
	is_delete?: number;
	created_at?: string;
	updated_at?: string;
	company_id?: number;
	price?: number;
}

export interface ProductCreateRequest {
	title: string;
	description: string;
	image_url?: string;
	detail_info?: string;
	company_id?: number;
}

export interface ProductUpdateRequest {
	title?: string;
	description?: string;
	image_url?: string;
	detail_info?: string;
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
