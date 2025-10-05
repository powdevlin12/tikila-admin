import type { FooterColumn } from './footerColumn';

export interface FooterLink {
	id?: number;
	title: string;
	url: string;
	orderPosition?: number;
	footerColumnId?: number;
	footerColumn?: FooterColumn;
	createdAt?: string;
}

export interface FooterLinkCreateRequest {
	title: string;
	url: string;
	orderPosition?: number;
	footerColumnId: number;
}

export interface FooterLinkUpdateRequest {
	title?: string;
	url?: string;
	orderPosition?: number;
	footerColumnId?: number;
}
