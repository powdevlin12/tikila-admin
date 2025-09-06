import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const { isAuthenticated, setUser, logout, token } = useAuthStore();

	console.log(
		'ProtectedRoute render - isAuthenticated:',
		isAuthenticated,
		'token:',
		token,
	);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				if (token) {
					console.log('Verifying token...');
					// Verify token by getting user info
					const response = await authService.getMe();
					console.log('Token verification successful:', response);
					setUser(response.result);
				} else {
					console.log('No token found, logging out');
					logout();
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				logout();
			} finally {
				setLoading(false);
			}
		};

		// Only check auth if we have a token but no user info yet
		if (token && !isAuthenticated) {
			console.log('Checking auth...');
			checkAuth();
		} else {
			console.log('Skipping auth check');
			setLoading(false);
		}
	}, [token, setUser, logout, isAuthenticated]);

	if (loading) {
		console.log('ProtectedRoute: Loading...');
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Spin size='large' />
			</div>
		);
	}

	if (!isAuthenticated) {
		console.log('ProtectedRoute: Not authenticated, redirecting to login');
		return <Navigate to='/login' replace />;
	}

	console.log('ProtectedRoute: Authenticated, rendering children');
	return <>{children}</>;
};

export default ProtectedRoute;
