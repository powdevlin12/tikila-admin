// Constants for admin panel
export const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || 'http://localhost:1236/api';

export const ROUTES = {
	DASHBOARD: '/admin',
	USERS: '/admin/users',
	PRODUCTS: '/admin/products',
	ORDERS: '/admin/orders',
	SETTINGS: '/admin/settings',
	LOGIN: '/admin/login',
} as const;

export const STATUS = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	PENDING: 'pending',
	DELETED: 'deleted',
} as const;

export const ROLES = {
	ADMIN: 'admin',
	MODERATOR: 'moderator',
	USER: 'user',
} as const;
