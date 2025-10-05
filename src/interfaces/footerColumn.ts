import type { FooterLink } from './footerLink';

export interface FooterColumn {
	id: number;
	title: string;
	position: number;
	footerLinks?: FooterLink[];
	createdAt: Date;
}

export interface CreateFooterColumnDto {
	title: string;
	position: number;
}

export interface UpdateFooterColumnDto {
	title?: string;
	position?: number;
}
