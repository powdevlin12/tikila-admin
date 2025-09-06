import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '../interfaces/auth';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	token: string | null;
	login: (user: User, token: string) => void;
	logout: () => void;
	setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
	devtools(
		set => {
			// Initialize from localStorage
			const token = localStorage.getItem('adminToken');

			return {
				user: null,
				isAuthenticated: !!token,
				token,
				login: (user: User, token: string) => {
					localStorage.setItem('adminToken', token);
					set({ user, isAuthenticated: true, token });
				},
				logout: () => {
					localStorage.removeItem('adminToken');
					set({ user: null, isAuthenticated: false, token: null });
				},
				setUser: (user: User) => {
					set({ user, isAuthenticated: true });
				},
			};
		},
		{
			name: 'auth-store',
		},
	),
);
