import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { Dashboard, Users, Products, Orders, Footer } from '../pages';
import { Login, Register } from '../pages/login';
import { ProtectedRoute } from '../components';
import MainLayout from '../layouts/MainLayout';
import { Company } from '../pages/company/Company';
import Introduce from '../pages/introduce';

const AppRouter: React.FC = () => {
	return (
		<Router>
			<Routes>
				{/* Public routes */}
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />

				{/* Protected routes */}
				<Route
					path='/admin'
					element={
						<ProtectedRoute>
							<MainLayout>
								<Company />
							</MainLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/contacts'
					element={
						<ProtectedRoute>
							<MainLayout>
								<Users />
							</MainLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/products'
					element={
						<ProtectedRoute>
							<MainLayout>
								<Products />
							</MainLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/introduce'
					element={
						<ProtectedRoute>
							<MainLayout>
								<Introduce />
							</MainLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/footer'
					element={
						<ProtectedRoute>
							<Footer />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/company'
					element={
						<ProtectedRoute>
							<MainLayout>
								<Company />
							</MainLayout>
						</ProtectedRoute>
					}
				/>

				{/* Default redirect */}
				<Route path='/' element={<Navigate to='/admin/company' replace />} />
			</Routes>
		</Router>
	);
};

export default AppRouter;
