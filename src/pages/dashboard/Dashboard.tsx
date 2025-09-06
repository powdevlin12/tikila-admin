import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	DollarOutlined,
	ShoppingCartOutlined,
	ShoppingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import React from 'react';

const Dashboard: React.FC = () => {
	const statsData = [
		{
			title: 'Total Users',
			value: '1,234',
			change: '+12%',
			isPositive: true,
			icon: <UserOutlined />,
			color: '#3b82f6',
		},
		{
			title: 'Total Products',
			value: '567',
			change: '+8%',
			isPositive: true,
			icon: <ShoppingOutlined />,
			color: '#10b981',
		},
		{
			title: 'Total Orders',
			value: '890',
			change: '-3%',
			isPositive: false,
			icon: <ShoppingCartOutlined />,
			color: '#f59e0b',
		},
		{
			title: 'Revenue',
			value: '$12,345',
			change: '+25%',
			isPositive: true,
			icon: <DollarOutlined />,
			color: '#8b5cf6',
		},
	];

	const recentActivities = [
		{
			id: 1,
			action: 'New user registered',
			user: 'John Doe',
			time: '2 minutes ago',
		},
		{
			id: 2,
			action: 'Order completed',
			user: 'Jane Smith',
			time: '5 minutes ago',
		},
		{ id: 3, action: 'Product updated', user: 'Admin', time: '10 minutes ago' },
		{
			id: 4,
			action: 'New order placed',
			user: 'Bob Johnson',
			time: '15 minutes ago',
		},
		{
			id: 5,
			action: 'User profile updated',
			user: 'Alice Brown',
			time: '20 minutes ago',
		},
	];

	return (
		<div className='modern-dashboard'>
			{/* Stats Cards */}
			<div className='dashboard-stats-grid'>
				{statsData.map((stat, index) => (
					<div key={index} className='modern-stat-card'>
						<div className='stat-card-header'>
							<div
								className='stat-icon'
								style={{ backgroundColor: stat.color }}
							>
								{stat.icon}
							</div>
							<div className='stat-trend'>
								{stat.isPositive ? (
									<ArrowUpOutlined className='trend-up' />
								) : (
									<ArrowDownOutlined className='trend-down' />
								)}
								<span
									className={
										stat.isPositive ? 'change-positive' : 'change-negative'
									}
								>
									{stat.change}
								</span>
							</div>
						</div>
						<div className='stat-content'>
							<h3 className='stat-title'>{stat.title}</h3>
							<p className='stat-value'>{stat.value}</p>
						</div>
					</div>
				))}
			</div>

			{/* Content Grid */}
			<div className='dashboard-content-grid'>
				{/* Recent Activities */}
				<div className='dashboard-card'>
					<div className='card-header'>
						<h2>Recent Activities</h2>
						<a href='#' className='view-all-link'>
							View All
						</a>
					</div>
					<div className='activity-list'>
						{recentActivities.map(activity => (
							<div key={activity.id} className='activity-item'>
								<div className='activity-info'>
									<p className='activity-action'>{activity.action}</p>
									<p className='activity-user'>by {activity.user}</p>
								</div>
								<span className='activity-time'>{activity.time}</span>
							</div>
						))}
					</div>
				</div>

				{/* Quick Actions */}
				<div className='dashboard-card'>
					<div className='card-header'>
						<h2>Quick Actions</h2>
					</div>
					<div className='quick-actions'>
						<button className='action-btn primary'>
							<UserOutlined />
							Add New User
						</button>
						<button className='action-btn secondary'>
							<ShoppingOutlined />
							Add Product
						</button>
						<button className='action-btn accent'>
							<ShoppingCartOutlined />
							View Orders
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
