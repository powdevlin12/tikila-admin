import { apiPut, apiPost } from './mutations';
import apiClient from './api';
import type { CompanyUpdateRequest, Service } from '../interfaces/company';

export class CompanyService {
	// Cập nhật thông tin công ty
	static async updateCompanyInfo(data: CompanyUpdateRequest) {
		return apiPut<{ success: boolean; message: string }>(
			'/company/info',
			data,
			{
				revalidateKeys: ['/company/info'],
			},
		);
	}

	// Upload logo công ty
	static async updateCompanyLogo(file: File) {
		const formData = new FormData();
		formData.append('image', file);

		return apiPut<{ success: boolean; message: string }>(
			'/company/info/logo',
			formData,
			{
				revalidateKeys: ['/company/info'],
			},
		);
	}

	// Upload ảnh giới thiệu
	static async updateCompanyImgIntro(file: File) {
		const formData = new FormData();
		formData.append('image', file);

		return apiPut<{ success: boolean; message: string }>(
			'/company/info/img-intro',
			formData,
			{
				revalidateKeys: ['/company/info'],
			},
		);
	}

	// Upload banner
	static async updateCompanyBanner(file: File) {
		const formData = new FormData();
		formData.append('image', file);

		return apiPut<{ success: boolean; message: string }>(
			'/company/info/banner',
			formData,
			{
				revalidateKeys: ['/company/info'],
			},
		);
	}

	// Tạo dịch vụ mới
	static async createService(
		data: Omit<Service, 'id' | 'created_at' | 'updated_at'>,
	) {
		return apiPost<{ success: boolean; message: string; data: { id: number } }>(
			'/company/services',
			data,
			{
				revalidateKeys: ['/company/services'],
			},
		);
	}

	// Lấy nội dung giới thiệu chi tiết
	static async getIntroDetail(): Promise<{
		success: boolean;
		message: string;
		data: { intro_text_detail: string };
	}> {
		return apiClient.get('/company/intro-detail');
	}

	// Cập nhật nội dung giới thiệu chi tiết
	static async updateIntroDetail(intro_text_detail: string) {
		return apiPut<{ success: boolean; message: string }>(
			'/company/intro-detail',
			{ intro_text_detail },
			{
				revalidateKeys: ['/company/intro-detail'],
			},
		);
	}

	// Upload ảnh cho editor
	static async uploadEditorImage(file: File): Promise<{
		url: Array<{ url: string; type: string }>;
		message: string;
	}> {
		const formData = new FormData();
		formData.append('image', file);

		return apiClient.post('/medias/upload-image', formData);
	}
}
