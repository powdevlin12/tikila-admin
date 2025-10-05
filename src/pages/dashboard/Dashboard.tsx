import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	ContactsOutlined,
	FileTextOutlined,
	ProductOutlined,
	ReloadOutlined,
	StarOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	List,
	message,
	Rate,
	Row,
	Spin,
	Statistic,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDashboardRefreshListener } from '../../hooks';
import type { DetailedDashboardData } from '../../interfaces';
import { dashboardService } from '../../services';

const Dashboard: React.FC = () => {
	const [dashboardData, setDashboardData] =
		useState<DetailedDashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchDashboardData = useCallback(async () => {
		try {
			setLoading(true);
			const response = await dashboardService.getDetailedDashboardStats();
			setDashboardData(response.data);
		} catch (error) {
			message.error('Không thể tải dữ liệu dashboard');
			console.error('Dashboard fetch error:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Listen for dashboard refresh events from other components
	useDashboardRefreshListener(fetchDashboardData);

	const handleRefreshStats = async () => {
		try {
			setRefreshing(true);
			await dashboardService.refreshDashboardStats();
			await fetchDashboardData();
			message.success('Dữ liệu đã được cập nhật');
		} catch {
			message.error('Không thể cập nhật dữ liệu');
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '400px',
				}}
			>
				<Spin size='large' />
			</div>
		);
	}

	// Default data structure when no data is available
	const defaultData: DetailedDashboardData = {
		statistics: {
			id: 0,
			totalContacts: 0,
			totalProducts: 0,
			totalReviews: 0,
			totalRegistrations: 0,
			totalUsers: 0,
			activeRegistrations: 0,
			expiredRegistrations: 0,
			averageRating: 0,
			newContactsThisMonth: 0,
			newRegistrationsThisMonth: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		recentContacts: [],
		recentRegistrations: [],
		topRatedReviews: [],
		registrationsByStatus: [],
	};

	const {
		statistics,
		recentContacts,
		recentRegistrations,
		topRatedReviews,
		registrationsByStatus,
	} = dashboardData || defaultData;

	console.log({
		dashboardData,
	});

	const statsData = [
		{
			title: 'Tổng số liên hệ',
			value: statistics.totalContacts,
			monthlyValue: statistics.newContactsThisMonth,
			icon: <ContactsOutlined />,
			color: '#1890ff',
		},
		{
			title: 'Tổng sản phẩm',
			value: statistics.totalProducts,
			icon: <ProductOutlined />,
			color: '#52c41a',
		},
		{
			title: 'Tổng đánh giá',
			value: statistics.totalReviews,
			avgRating: statistics.averageRating,
			icon: <StarOutlined />,
			color: '#faad14',
		},
		{
			title: 'Tổng đăng ký',
			value: statistics.totalRegistrations,
			monthlyValue: statistics.newRegistrationsThisMonth,
			icon: <FileTextOutlined />,
			color: '#722ed1',
		},
		{
			title: 'Tổng tài khoản admin',
			value: statistics.totalUsers,
			icon: <UserOutlined />,
			color: '#eb2f96',
		},
		{
			title: 'Đăng ký hoạt động',
			value: statistics.activeRegistrations,
			icon: <CheckCircleOutlined />,
			color: '#13c2c2',
		},
	];

	return (
		<div className='modern-dashboard'>
			{/* Header with refresh button */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '24px',
				}}
			>
				<div>
					<h1>Dashboard</h1>
					{!dashboardData && (
						<div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
							Đang hiển thị dữ liệu mặc định - Vui lòng cập nhật dữ liệu
						</div>
					)}
				</div>
				<Button
					type='primary'
					icon={<ReloadOutlined />}
					loading={refreshing}
					onClick={handleRefreshStats}
				>
					Cập nhật dữ liệu
				</Button>
			</div>

			{/* Stats Cards */}
			<Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
				{statsData.map((stat, index) => (
					<Col xs={24} sm={12} lg={8} xl={4} key={index}>
						<Card>
							<Statistic
								title={stat.title}
								value={stat.value}
								prefix={
									<div style={{ color: stat.color, fontSize: '24px' }}>
										{stat.icon}
									</div>
								}
								suffix={
									stat.avgRating ? (
										<div style={{ fontSize: '12px', color: '#666' }}>
											<Rate
												disabled
												defaultValue={stat.avgRating}
												allowHalf
												style={{ fontSize: '12px' }}
											/>
											<div>({stat?.avgRating ?? ''})</div>
										</div>
									) : stat.monthlyValue !== undefined ? (
										<div style={{ fontSize: '12px', color: '#666' }}>
											Tháng này: {stat.monthlyValue}
										</div>
									) : null
								}
							/>
						</Card>
					</Col>
				))}
			</Row>

			{/* Content Grid */}
			<Row gutter={[16, 16]}>
				{/* Recent Contacts */}
				<Col xs={24} lg={12}>
					<Card
						title='Liên hệ gần đây'
						extra={<a href='admin/contacts'>Xem tất cả</a>}
					>
						<List
							itemLayout='horizontal'
							dataSource={recentContacts.slice(0, 2)}
							locale={{ emptyText: 'Chưa có liên hệ nào' }}
							renderItem={contact => (
								<List.Item>
									<List.Item.Meta
										avatar={<ContactsOutlined style={{ color: '#1890ff' }} />}
										title={contact.fullName}
										description={
											<div>
												<div>Điện thoại: {contact.phoneCustomer}</div>
												<div style={{ fontSize: '12px', color: '#666' }}>
													{new Date(contact.createdAt).toLocaleDateString(
														'vi-VN',
													)}
												</div>
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</Card>
				</Col>

				{/* Recent Registrations */}
				<Col xs={24} lg={12}>
					<Card
						title='Đăng ký gần đây'
						extra={<a href='admin/service-registrations'>Xem tất cả</a>}
					>
						<List
							itemLayout='horizontal'
							dataSource={recentRegistrations.slice(0, 5)}
							locale={{ emptyText: 'Chưa có đăng ký nào' }}
							renderItem={registration => (
								<List.Item>
									<List.Item.Meta
										avatar={
											registration.status === 'active' ? (
												<CheckCircleOutlined style={{ color: '#52c41a' }} />
											) : (
												<ClockCircleOutlined style={{ color: '#faad14' }} />
											)
										}
										title={registration.customer_name}
										description={
											<div>
												<div>Điện thoại: {registration.phone}</div>
												<div style={{ fontSize: '12px', color: '#666' }}>
													Trạng thái: {registration.status} -{' '}
													{registration.duration_months} tháng
												</div>
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</Card>
				</Col>

				{/* Top Rated Reviews */}
				<Col xs={24} lg={12}>
					<Card
						title='Đánh giá'
						extra={<a href='admin/star-customers'>Xem tất cả</a>}
					>
						<List
							itemLayout='horizontal'
							dataSource={topRatedReviews}
							locale={{ emptyText: 'Chưa có đánh giá nào' }}
							renderItem={review => (
								<List.Item>
									<List.Item.Meta
										avatar={<StarOutlined style={{ color: '#faad14' }} />}
										title={
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
												}}
											>
												{review.nameCustomer}
												<Rate
													disabled
													defaultValue={review.star}
													style={{ fontSize: '14px' }}
												/>
											</div>
										}
										description={
											<div>
												{review.content && (
													<div style={{ marginBottom: '4px' }}>
														{review.content.substring(0, 100)}
														{review.content.length > 100 && '...'}
													</div>
												)}
												<div style={{ fontSize: '12px', color: '#666' }}>
													{new Date(review.createdAt).toLocaleDateString(
														'vi-VN',
													)}
												</div>
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</Card>
				</Col>

				{/* Registration Status Distribution */}
				<Col xs={24} lg={12}>
					<Card title='Phân bố trạng thái đăng ký'>
						<List
							itemLayout='horizontal'
							dataSource={registrationsByStatus}
							locale={{ emptyText: 'Chưa có dữ liệu thống kê' }}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										title={
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ textTransform: 'capitalize' }}>
													{item.status === 'active'
														? 'Hoạt động'
														: item.status === 'expired'
														? 'Hết hạn'
														: 'Đã huỷ'}
												</span>
												<span style={{ fontWeight: 'bold' }}>{item.count}</span>
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
