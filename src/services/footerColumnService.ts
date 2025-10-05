import apiClient from './api';
import { apiPost, apiPut, apiDelete } from './mutations';
import type {
	FooterColumn,
	CreateFooterColumnDto,
	UpdateFooterColumnDto,
} from '../interfaces/footerColumn';

export class FooterColumnService {
	// Lấy tất cả footer columns
	static async getAllFooterColumns(): Promise<FooterColumn[]> {
		const response = await apiClient.get<{
			isSuccess: boolean;
			message: string;
			data: FooterColumn[];
		}>('/footer-columns');
		return response.data.data;
	}

	// Lấy footer column theo ID
	static async getFooterColumnById(id: string): Promise<FooterColumn> {
		const response = await apiClient.get<{
			isSuccess: boolean;
			message: string;
			data: FooterColumn;
		}>(`/footer-columns/${id}`);
		return response.data.data;
	}

	// Tạo footer column mới
	static async createFooterColumn(data: CreateFooterColumnDto) {
		return apiPost<{
			isSuccess: boolean;
			message: string;
			data: FooterColumn;
		}>('/footer-columns', data, {
			revalidateKeys: ['/footer-columns'],
		});
	}

	// Cập nhật footer column
	static async updateFooterColumn(id: string, data: UpdateFooterColumnDto) {
		return apiPut<{
			isSuccess: boolean;
			message: string;
			data: FooterColumn;
		}>(`/footer-columns/${id}`, data, {
			revalidateKeys: ['/footer-columns'],
		});
	}

	// Xóa footer column
	static async deleteFooterColumn(id: string) {
		return apiDelete<{
			isSuccess: boolean;
			message: string;
		}>(`/footer-columns/${id}`, {
			revalidateKeys: ['/footer-columns'],
		});
	}
}
