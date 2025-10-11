import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

interface HeaderProps {
	title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Admin Dashboard' }) => {
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const items: MenuProps['items'] = [
		{
			key: 'profile',
			icon: <UserOutlined />,
			label: 'Thông tin cá nhân',
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: handleLogout,
		},
	];

	return (
		<header
			className='admin-header'
			style={{
				padding: '16px 24px',
				background: '#fff',
				borderBottom: '1px solid #f0f0f0',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				minWidth: 'calc(100vw - 320px)',
			}}
		>
			<Title level={3} style={{ margin: 0, color: '#1890ff' }}>
				{title}
			</Title>
			<Space>
				<Text>Xin chào, {user?.name || 'Admin'}</Text>
				<Dropdown menu={{ items }} placement='bottomRight'>
					<Avatar
						size='large'
						icon={<UserOutlined />}
						src={user?.avatar}
						style={{ cursor: 'pointer' }}
					/>
				</Dropdown>
			</Space>
		</header>
	);
};

export default Header;
