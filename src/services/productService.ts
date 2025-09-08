import apiClient from './api';
import type {
	Product,
	ProductCreateRequest,
	ProductUpdateRequest,
	ProductWithImage,
} from '../interfaces';

export class ProductService {
	// Get all products
	static async getProducts(): Promise<Product[]> {
		const response = await apiClient.get<Product[]>('/products');
		return response.data;
	}

	// Get product by ID
	static async getProductById(id: string): Promise<Product> {
		const response = await apiClient.get<Product>(`/products/${id}`);
		return response.data;
	}

	// Create product with image upload
	static async createProductWithImage(
		data: ProductWithImage,
	): Promise<Product> {
		const formData = new FormData();
		formData.append('title', data.name); // Backend expects 'title' not 'name'
		formData.append('description', data.description);
		if (data.price) formData.append('price', data.price.toString());
		if (data.company_id)
			formData.append('company_id', data.company_id.toString());
		if (data.detail_info) formData.append('detail_info', data.detail_info);
		formData.append('image', data.image);

		const response = await apiClient.post<Product>('/products/add', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	}

	// Create product with image URL
	static async createProduct(data: ProductCreateRequest): Promise<Product> {
		// Transform frontend field names to backend field names
		const backendData = {
			title: data.name, // Backend expects 'title'
			description: data.description,
			image_url: data.image_url,
			price: data.price,
		};

		const response = await apiClient.post<Product>(
			'/products/add-with-url',
			backendData,
		);
		return response.data;
	}

	// Update product
	static async updateProduct(
		id: string,
		data: ProductUpdateRequest,
	): Promise<Product> {
		// Transform frontend field names to backend field names
		const backendData = {
			title: data.name, // Backend expects 'title'
			description: data.description,
			image_url: data.image_url,
			// Note: Backend doesn't support status update, only soft delete via delete endpoint
		};

		const response = await apiClient.put<Product>(
			`/products/${id}`,
			backendData,
		);
		return response.data;
	}

	// Update product with image
	static async updateProductWithImage(
		id: string,
		data: Partial<ProductWithImage>,
	): Promise<Product> {
		const formData = new FormData();

		if (data.name) formData.append('title', data.name); // Backend expects 'title'
		if (data.description) formData.append('description', data.description);
		if (data.price) formData.append('price', data.price.toString());
		if (data.company_id)
			formData.append('company_id', data.company_id.toString());
		if (data.detail_info) formData.append('detail_info', data.detail_info);
		if (data.image) formData.append('image', data.image);

		const response = await apiClient.put<Product>(`/products/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	}

	// Delete product (soft delete)
	static async deleteProduct(id: string): Promise<void> {
		await apiClient.delete(`/products/${id}`);
	}
}
