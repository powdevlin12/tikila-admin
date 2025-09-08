import apiClient from './api';
import { apiPost, apiPut, apiDelete } from './mutations';
import type {
	FooterLink,
	FooterLinkCreateRequest,
	FooterLinkUpdateRequest,
} from '../interfaces/company';

export class FooterLinkService {
	// Lấy tất cả footer links
	static async getAllFooterLinks(): Promise<FooterLink[]> {
		const response = await apiClient.get<FooterLink[]>('/company/footer-links');
		return response.data;
	}

	// Lấy footer links theo column
	static async getFooterLinksByColumn(
		columnPosition: number,
	): Promise<FooterLink[]> {
		const response = await apiClient.get<FooterLink[]>(
			`/footer-links/column/${columnPosition}`,
		);
		return response.data;
	}

	// Tạo footer link mới
	static async createFooterLink(data: FooterLinkCreateRequest) {
		return apiPost<{ success: boolean; message: string; data: { id: number } }>(
			'/footer-links',
			data,
			{
				revalidateKeys: ['/company/footer-links'],
			},
		);
	}

	// Cập nhật footer link
	static async updateFooterLink(id: string, data: FooterLinkUpdateRequest) {
		return apiPut<{ success: boolean; message: string }>(
			`/footer-links/${id}`,
			data,
			{
				revalidateKeys: ['/company/footer-links'],
			},
		);
	}

	// Xóa footer link
	static async deleteFooterLink(id: string) {
		return apiDelete<{ success: boolean; message: string }>(
			`/footer-links/${id}`,
			{
				revalidateKeys: ['/company/footer-links'],
			},
		);
	}

	// Xóa tất cả footer links theo column
	static async deleteFooterLinksByColumn(columnPosition: number) {
		return apiDelete<{ success: boolean; message: string }>(
			`/footer-links/column/${columnPosition}`,
			{
				revalidateKeys: ['/company/footer-links'],
			},
		);
	}
}
