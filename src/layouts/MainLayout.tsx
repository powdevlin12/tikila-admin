import React from 'react';
import { AdminLayout } from '../components';

interface MainLayoutProps {
	children: React.ReactNode;
	title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
	return <AdminLayout title={title}>{children}</AdminLayout>;
};

export default MainLayout;
