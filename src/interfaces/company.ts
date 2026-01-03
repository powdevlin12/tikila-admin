export interface CompanyInfo {
	id?: number;
	name?: string;
	logoUrl?: string;
	introText?: string;
	address?: string;
	taxCode?: string;
	email?: string;
	welcomeContent?: string;
	versionInfo?: number | null;
	contactId?: number | null;
	imgIntro?: string;
	banner?: string;
	countCustomer?: number;
	countCustomerSatisfy?: number;
	countQuality?: number;
	introTextDetail?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CompanyContact {
	id?: number;
	phone?: string;
	facebookLink?: string;
	zaloLink?: string;
	tiktokLink?: string;
	createdAt?: string;
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
	logo_url?: string;
	intro_text?: string;
	address?: string;
	tax_code?: string;
	email?: string;
	welcome_content?: string;
	version_info?: number;
	contact_id?: number;
	img_intro?: string;
	banner?: string;
	count_customer?: number;
	count_customer_satisfy?: number;
	count_quality?: number;
	intro_text_detail?: string;
}

export interface CompanyContactUpdateRequest {
	phone?: string;
	facebook_link?: string;
	zalo_link?: string;
	tiktok_link?: string;
}
