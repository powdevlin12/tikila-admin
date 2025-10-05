import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import {
	Users,
	Products,
	Footer,
	CreateEditProduct,
	Dashboard,
} from '../pages';
import { StarCustomer } from '../pages/start-customer';
import { ServiceRegistrations } from '../pages/service-registrations';
import { Login, Register } from '../pages/login';
import { ProtectedRoute } from '../components';
import MainLayout from '../layouts/MainLayout';
import { Company } from '../pages/company/Company';
import FooterColumns from '../pages/footer-columns';
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
								<Dashboard />
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
					path='/admin/products/create'
					element={
						<ProtectedRoute>
							<CreateEditProduct />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/products/edit/:id'
					element={
						<ProtectedRoute>
							<CreateEditProduct />
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
					path='/admin/star-customers'
					element={
						<ProtectedRoute>
							<MainLayout>
								<StarCustomer />
							</MainLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/service-registrations'
					element={
						<ProtectedRoute>
							<MainLayout>
								<ServiceRegistrations />
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
					path='/admin/footer-columns'
					element={
						<ProtectedRoute>
							<FooterColumns />
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
