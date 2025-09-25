import axios from 'axios';

// Tạo axios instance với config mặc định
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'https://powdevlin68.info/api',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor - thêm token nếu có
apiClient.interceptors.request.use(
	config => {
		const token = localStorage.getItem('adminToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Nếu data là FormData, xóa Content-Type để browser tự set
		if (config.data instanceof FormData) {
			delete config.headers['Content-Type'];
		}

		return config;
	},
	error => {
		return Promise.reject(error);
	},
);

// Response interceptor - xử lý lỗi chung
apiClient.interceptors.response.use(
	response => {
		return response.data;
	},
	error => {
		if (error.response?.status === 401) {
			// Token hết hạn, redirect về login
			localStorage.removeItem('adminToken');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	},
);

export default apiClient;
