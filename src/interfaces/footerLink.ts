export interface FooterLink {
	id?: number;
	title: string;
	url: string;
	column_position: number;
	title_column?: string;
	created_at?: string;
}

export interface FooterLinkCreateRequest {
	title: string;
	url: string;
	column_position: number;
	title_column?: string;
}

export interface FooterLinkUpdateRequest {
	title?: string;
	url?: string;
	column_position?: number;
	title_column?: string;
}
