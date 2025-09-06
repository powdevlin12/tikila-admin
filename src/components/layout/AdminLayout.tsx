import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
	children: React.ReactNode;
	title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
	return (
		<div className='admin-layout'>
			<Sidebar />
			<div className='main-content'>
				<Header title={title} />
				<main className='content'>{children}</main>
			</div>
		</div>
	);
};

export default AdminLayout;
