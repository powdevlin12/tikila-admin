import { authService } from '../services/authService';

export interface ApiError {
	response?: {
		status: number;
		data?: {
			message: string;
		};
	};
	message?: string;
}

export const handleApiError = (error: unknown, customMessage?: string): void => {
	console.error('API Error:', error);
	
	const errorResponse = error as ApiError;
	
	if (errorResponse.response?.status === 401) {
		alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
		authService.removeToken();
		window.location.href = '/login';
		return;
	}

	const message = customMessage || 'Có lỗi xảy ra';
	const errorMessage = errorResponse.response?.data?.message || errorResponse.message || 'Unknown error';
	alert(`${message}: ${errorMessage}`);
};

export const checkAuthentication = (isAuthenticated: boolean, token: string | null): boolean => {
	if (!isAuthenticated || !token) {
		alert('Bạn cần đăng nhập để thực hiện thao tác này');
		return false;
	}
	return true;
};
