// Common interfaces for admin panel
export * from './auth';
export * from './company';
export * from './contact';
export * from './product';
export * from './starCustomer';
export * from './serviceRegistration';
export * from './dashboard';
export * from './footerLink';
export * from './footerColumn';

export interface User {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'moderator' | 'user';
	status: 'active' | 'inactive' | 'pending';
	createdAt: string;
	updatedAt: string;
}

export interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
	imageUrl?: string;
	isDelete: number;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	id: string;
	userId: string;
	products: OrderItem[];
	total: number;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	createdAt: string;
	updatedAt: string;
}

export interface OrderItem {
	productId: string;
	productName: string;
	quantity: number;
	price: number;
}

export interface ApiResponse<T> {
	data: T;
	message: string;
	success: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface TableColumn<T = unknown> {
	key: keyof T | string;
	title: string;
	render?: (value: unknown, record: T) => React.ReactNode;
}

export interface FormField {
	name: string;
	label: string;
	type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
	required?: boolean;
	options?: { label: string; value: string }[];
	placeholder?: string;
}
