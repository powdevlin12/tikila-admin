import apiClient from './api';
import { apiPost, apiPut, apiDelete } from './mutations';
import type {
	FooterLink,
	FooterLinkCreateRequest,
	FooterLinkUpdateRequest,
} from '../interfaces/footerLink';

export class FooterLinkService {
	// Lấy tất cả footer links
	static async getAllFooterLinks(): Promise<FooterLink[]> {
		const response = await apiClient.get<{
			isSuccess: boolean;
			message: string;
			data: FooterLink[];
		}>('/footer-links');
		return response.data.data;
	}

	// Lấy footer links theo column
	static async getFooterLinksByColumn(
		footerColumnId: number,
	): Promise<FooterLink[]> {
		const response = await apiClient.get<{
			isSuccess: boolean;
			message: string;
			data: FooterLink[];
		}>(`/footer-links/column/${footerColumnId}`);
		return response.data.data;
	}

	// Lấy footer links được nhóm theo column
	static async getFooterLinksGrouped(): Promise<any> {
		const response = await apiClient.get<{
			isSuccess: boolean;
			message: string;
			data: any;
		}>('/footer-links/grouped');
		return response.data.data;
	}

	// Tạo footer link mới
	static async createFooterLink(data: FooterLinkCreateRequest) {
		return apiPost<{
			isSuccess: boolean;
			message: string;
			data: FooterLink;
		}>('/footer-links', data, {
			revalidateKeys: ['/footer-links', '/footer-links/grouped'],
		});
	}

	// Cập nhật footer link
	static async updateFooterLink(id: string, data: FooterLinkUpdateRequest) {
		return apiPut<{
			isSuccess: boolean;
			message: string;
			data: FooterLink;
		}>(`/footer-links/${id}`, data, {
			revalidateKeys: ['/footer-links', '/footer-links/grouped'],
		});
	}

	// Xóa footer link
	static async deleteFooterLink(id: string) {
		return apiDelete<{
			isSuccess: boolean;
			message: string;
		}>(`/footer-links/${id}`, {
			revalidateKeys: ['/footer-links', '/footer-links/grouped'],
		});
	}
}
