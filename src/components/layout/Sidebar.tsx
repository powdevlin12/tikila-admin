import React from 'react';
import { NavLink } from 'react-router-dom';
import {
	DashboardOutlined,
	UserOutlined,
	ShoppingOutlined,
	ShoppingCartOutlined,
	SettingOutlined,
} from '@ant-design/icons';

interface SidebarProps {
	children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
	const menuItems = [
		{
			path: '/admin',
			icon: <DashboardOutlined />,
			label: 'Dashboard',
			exact: true,
		},
		{
			path: '/admin/users',
			icon: <UserOutlined />,
			label: 'Users',
		},
		{
			path: '/admin/products',
			icon: <ShoppingOutlined />,
			label: 'Products',
		},
		{
			path: '/admin/company',
			icon: <ShoppingCartOutlined />,
			label: 'Company',
		},
	];

	return (
		<div className='modern-sidebar'>
			<div className='sidebar-header'>
				<div className='logo'>
					<img src='/logo.png' alt='Logo' className='logo-img' />
					<h2>Tikila Admin</h2>
				</div>
			</div>

			<nav className='sidebar-nav'>
				<ul className='nav-list'>
					{menuItems.map(item => (
						<li key={item.path} className='nav-item'>
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									`nav-link ${isActive ? 'active' : ''}`
								}
								end={item.exact}
							>
								<span className='nav-icon'>{item.icon}</span>
								<span className='nav-label'>{item.label}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>

			<div className='sidebar-footer'>
				<div className='nav-item'>
					<a href='#' className='nav-link'>
						<span className='nav-icon'>
							<SettingOutlined />
						</span>
						<span className='nav-label'>Settings</span>
					</a>
				</div>
			</div>

			{children}
		</div>
	);
};

export default Sidebar;
