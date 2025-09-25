// Utility functions for admin panel
export * from './errorHandler';

export const formatDate = (date: string | Date): string => {
	const d = new Date(date);
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
};

export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const generateId = (): string => {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const debounce = <T extends (...args: unknown[]) => void>(
	func: T,
	wait: number,
): ((...args: Parameters<T>) => void) => {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

export const getStatusColor = (status: string): string => {
	const statusColors: Record<string, string> = {
		active: '#10b981',
		inactive: '#6b7280',
		pending: '#f59e0b',
		cancelled: '#ef4444',
		delivered: '#10b981',
		processing: '#3b82f6',
	};
	return statusColors[status] || '#6b7280';
};
