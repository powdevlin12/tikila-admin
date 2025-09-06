import apiClient from './api';
import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	GetMeResponse,
} from '../interfaces/auth';

class AuthService {
	private readonly basePath = '/users';

	async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await apiClient.post(
			`${this.basePath}/login`,
			credentials,
		);
		return response;
	}

	async register(userData: RegisterRequest): Promise<RegisterResponse> {
		const response = await apiClient.post(
			`${this.basePath}/register`,
			userData,
		);
		return response;
	}

	async getMe(): Promise<GetMeResponse> {
		const response = await apiClient.get(`${this.basePath}/get-me`);
		return response;
	}

	// Utility methods
	setToken(token: string): void {
		localStorage.setItem('adminToken', token);
	}

	getToken(): string | null {
		return localStorage.getItem('adminToken');
	}

	removeToken(): void {
		localStorage.removeItem('adminToken');
	}

	isAuthenticated(): boolean {
		return !!this.getToken();
	}
}

export const authService = new AuthService();
