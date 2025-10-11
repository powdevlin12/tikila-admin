import type { Product } from '../interfaces/product';

/**
 * Utility functions to handle backward compatibility between old snake_case
 * and new camelCase field names for Products from TypeORM entities
 */

export const getProductImageUrl = (product: Product): string => {
	return product.imageUrl || product.image_url || '';
};

export const getProductDetailInfo = (product: Product): string => {
	return product.detailInfo || product.detail_info || '';
};

export const getProductCreatedAt = (product: Product): string => {
	return product.createdAt || product.created_at || '';
};

export const getProductCompanyId = (product: Product): number | null => {
	return product.companyId ?? product.company_id ?? null;
};

export const getProductIsDelete = (product: Product): boolean => {
	// Handle both boolean and number types for backward compatibility
	if (typeof product.isDelete === 'boolean') {
		return product.isDelete;
	}
	if (typeof product.is_delete === 'number') {
		return product.is_delete === 1;
	}
	return false;
};
