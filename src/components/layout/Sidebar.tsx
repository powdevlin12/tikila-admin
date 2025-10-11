import React from 'react';
import { NavLink } from 'react-router-dom';
import {
	DashboardOutlined,
	UserOutlined,
	ShoppingOutlined,
	SettingOutlined,
	InfoCircleOutlined,
	HomeOutlined,
	StarOutlined,
	CalendarOutlined,
} from '@ant-design/icons';

interface SidebarProps {
	children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
	const menuItems = [
		{
			path: '/admin/company',
			icon: <HomeOutlined />,
			label: 'Công ty',
		},
		{
			path: '/admin/contacts',
			icon: <UserOutlined />,
			label: 'Liên hệ',
		},
		{
			path: '/admin/products',
			icon: <ShoppingOutlined />,
			label: 'Dịch vụ',
		},
		{
			path: '/admin/star-customers',
			icon: <StarOutlined />,
			label: 'Đánh giá khách hàng',
		},
		{
			path: '/admin/service-registrations',
			icon: <CalendarOutlined />,
			label: 'Đăng ký dịch vụ',
		},
		{
			path: '/admin/footer',
			icon: <SettingOutlined />,
			label: 'Footer',
		},
		{
			path: '/admin/introduce',
			icon: <InfoCircleOutlined />,
			label: 'Giới thiệu',
		},
		{
			path: '/admin',
			icon: <DashboardOutlined />,
			label: 'Dashboard',
			exact: true,
		},
	];

	return (
		<div className='modern-sidebar'>
			<div className='sidebar-header'>
				<div className='logo'>
					<img src='/logo.png' alt='Logo' className='logo-img' />
					<h2>Tikila</h2>
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
