export interface CompanyInfo {
	id?: number;
	name?: string;
	logo_url?: string;
	intro_text?: string;
	address?: string;
	tax_code?: string;
	email?: string;
	welcome_content?: string;
	img_intro?: string;
	COUNT_CUSTOMER?: number;
	COUNT_CUSTOMER_SATISFY?: number;
	COUNT_QUANLITY?: number;
	BANNER?: string;
	created_at?: string;
	updated_at?: string;
}

export interface CompanyContact {
	id?: number;
	phone?: string;
	facebook_link?: string;
	zalo_link?: string;
	tiktok_link?: string;
	created_at?: string;
}

export interface Service {
	id?: number;
	title: string;
	description: string;
	image_url?: string;
	company_id?: number;
	created_at?: string;
	updated_at?: string;
}

export interface CompanyUpdateRequest {
	name?: string;
	intro_text?: string;
	address?: string;
	tax_code?: string;
	email?: string;
	welcome_content?: string;
	COUNT_CUSTOMER?: number;
	COUNT_CUSTOMER_SATISFY?: number;
	COUNT_QUANLITY?: number;
}

export interface CompanyContactUpdateRequest {
	phone?: string;
	facebook_link?: string;
	zalo_link?: string;
	tiktok_link?: string;
}
