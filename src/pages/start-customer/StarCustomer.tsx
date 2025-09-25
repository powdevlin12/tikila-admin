import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Rate,
	Card,
	Statistic,
	Space,
	message,
	Popconfirm,
	Tag,
	Row,
	Col,
	Typography,
	Spin,
	Alert,
} from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	EyeOutlined,
	StarFilled,
} from '@ant-design/icons';
import { useApi } from '../../services';
import { StarCustomerService } from '../../services/starCustomerService';
import { handleApiError } from '../../utils/errorHandler';
import type {
	StarCustomer,
	CreateStarCustomerPayload,
	StarCustomerStats,
} from '../../interfaces/starCustomer';

const { Title } = Typography;
const { TextArea } = Input;

export const StarCustomerPage: React.FC = () => {
	const [selectedStarCustomer, setSelectedStarCustomer] =
		useState<StarCustomer | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating'>('date');
	const [filterByRating, setFilterByRating] = useState<number | 'all'>('all');
	const [form] = Form.useForm();

	// Fetch star customers data
	const {
		data: starCustomersResponse,
		mutate: mutateStarCustomers,
		error,
		loading,
	} = useApi<{
		success: boolean;
		message: string;
		data: StarCustomer[];
	}>('/star-customers');

	const starCustomers = useMemo(() => {
		console.log('starCustomersResponse:', starCustomersResponse);
		return starCustomersResponse?.data || [];
	}, [starCustomersResponse]);

	// Calculate statistics
	const stats: StarCustomerStats = useMemo(() => {
		return StarCustomerService.calculateStats(starCustomers);
	}, [starCustomers]);

	// Filter and sort star customers
	const filteredStarCustomers = useMemo(() => {
		let filtered = starCustomers;

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(
				customer =>
					customer.name_customer
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					(customer.content &&
						customer.content.toLowerCase().includes(searchTerm.toLowerCase())),
			);
		}

		// Rating filter
		if (filterByRating !== 'all') {
			filtered = filtered.filter(customer => customer.star === filterByRating);
		}

		// Sort
		filtered.sort((a, b) => {
			if (sortBy === 'date') {
				return (
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
			} else if (sortBy === 'name') {
				return a.name_customer.localeCompare(b.name_customer);
			} else {
				return b.star - a.star;
			}
		});

		return filtered;
	}, [starCustomers, searchTerm, sortBy, filterByRating]);

	// Handle add star customer
	const handleAddStarCustomer = async (values: CreateStarCustomerPayload) => {
		setIsAdding(true);
		try {
			const result = await StarCustomerService.addStarCustomer(values);
			console.log('Add star customer result:', result);
			message.success('Thêm đánh giá khách hàng thành công!');
			setShowAddModal(false);
			form.resetFields();
			// Force refresh data
			await mutateStarCustomers();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi thêm đánh giá khách hàng');
		} finally {
			setIsAdding(false);
		}
	};

	// Handle delete star customer
	const handleDeleteStarCustomer = async (customer: StarCustomer) => {
		setIsDeleting(true);
		try {
			await StarCustomerService.deleteStarCustomer(customer.id);
			message.success('Xóa đánh giá thành công!');
			// Force refresh data
			await mutateStarCustomers();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi xóa đánh giá');
		} finally {
			setIsDeleting(false);
		}
	};

	// Handle view star customer detail
	const handleViewDetail = (customer: StarCustomer) => {
		setSelectedStarCustomer(customer);
		setShowDetailModal(true);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Table columns configuration
	const columns = [
		{
			title: 'Tên khách hàng',
			dataIndex: 'name_customer',
			key: 'name_customer',
			filterable: true,
		},
		{
			title: 'Đánh giá',
			dataIndex: 'star',
			key: 'star',
			render: (star: number) => <Rate disabled defaultValue={star} />,
			filters: [
				{ text: '5 sao', value: 5 },
				{ text: '4 sao', value: 4 },
				{ text: '3 sao', value: 3 },
				{ text: '2 sao', value: 2 },
				{ text: '1 sao', value: 1 },
			],
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
			key: 'content',
			render: (content: string) => (
				<div style={{ maxWidth: 200 }}>
					{content
						? content.length > 50
							? `${content.substring(0, 50)}...`
							: content
						: 'Không có nội dung'}
				</div>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (date: string) => formatDate(date),
			sorter: (a: StarCustomer, b: StarCustomer) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_: unknown, record: StarCustomer) => (
				<Space>
					<Button
						type='link'
						icon={<EyeOutlined />}
						onClick={() => handleViewDetail(record)}
					>
						Xem chi tiết
					</Button>
					<Popconfirm
						title='Xóa đánh giá'
						description={`Bạn có chắc chắn muốn xóa đánh giá của ${record.name_customer}?`}
						onConfirm={() => handleDeleteStarCustomer(record)}
						okText='Có'
						cancelText='Không'
					>
						<Button
							type='link'
							danger
							icon={<DeleteOutlined />}
							loading={isDeleting}
						>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: '50px' }}>
				<Spin size='large' />
				<div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div style={{ padding: '20px' }}>
				<Alert
					message='Lỗi tải dữ liệu'
					description={error.message}
					type='error'
					showIcon
					action={
						<Button onClick={() => mutateStarCustomers()}>Thử lại</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div style={{ padding: '24px', width: 'calc(100vw - 320px)' }}>
			<Title level={2}>Quản lý đánh giá khách hàng</Title>

			{/* Statistics Section */}
			<Row gutter={16} style={{ marginBottom: '24px' }}>
				<Col span={8}>
					<Card>
						<Statistic
							title='Tổng đánh giá'
							value={stats.total}
							prefix={<StarFilled />}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Điểm trung bình'
							value={stats.averageRating}
							suffix='/ 5'
							precision={1}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<div>
							<div style={{ marginBottom: '8px', fontWeight: 500 }}>
								Phân bố đánh giá
							</div>
							{Object.entries(stats.distribution)
								.reverse()
								.map(([star, count]) => (
									<div
										key={star}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginBottom: '4px',
										}}
									>
										<span>{star}★</span>
										<Tag color='blue'>{count}</Tag>
									</div>
								))}
						</div>
					</Card>
				</Col>
			</Row>

			{/* Controls Section */}
			<Card style={{ marginBottom: '24px' }}>
				<Space
					style={{
						width: '100%',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
					}}
				>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => setShowAddModal(true)}
					>
						Thêm đánh giá mới
					</Button>
					<Space>
						<Input.Search
							placeholder='Tìm kiếm theo tên khách hàng hoặc nội dung...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							style={{ width: 300 }}
							allowClear
						/>
						<Select
							value={sortBy}
							onChange={setSortBy}
							style={{ width: 150 }}
							placeholder='Sắp xếp'
						>
							<Select.Option value='date'>Ngày tạo</Select.Option>
							<Select.Option value='name'>Tên khách hàng</Select.Option>
							<Select.Option value='rating'>Điểm đánh giá</Select.Option>
						</Select>
						<Select
							value={filterByRating}
							onChange={setFilterByRating}
							style={{ width: 120 }}
							placeholder='Lọc sao'
						>
							<Select.Option value='all'>Tất cả</Select.Option>
							<Select.Option value={5}>5 sao</Select.Option>
							<Select.Option value={4}>4 sao</Select.Option>
							<Select.Option value={3}>3 sao</Select.Option>
							<Select.Option value={2}>2 sao</Select.Option>
							<Select.Option value={1}>1 sao</Select.Option>
						</Select>
					</Space>
				</Space>
			</Card>

			{/* Table */}
			<Card>
				<Table
					dataSource={filteredStarCustomers}
					columns={columns}
					rowKey='id'
					pagination={{
						total: filteredStarCustomers.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} của ${total} đánh giá`,
					}}
				/>
			</Card>

			{/* Add Star Customer Modal */}
			<Modal
				open={showAddModal}
				title='Thêm đánh giá khách hàng mới'
				onCancel={() => {
					setShowAddModal(false);
					form.resetFields();
				}}
				footer={null}
				width={600}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={handleAddStarCustomer}
					initialValues={{ star: 5 }}
				>
					<Form.Item
						label='Tên khách hàng'
						name='name_customer'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên khách hàng!' },
						]}
					>
						<Input placeholder='Nhập tên khách hàng' />
					</Form.Item>

					<Form.Item
						label='Đánh giá'
						name='star'
						rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
					>
						<Rate />
					</Form.Item>

					<Form.Item label='Nội dung đánh giá' name='content'>
						<TextArea
							rows={4}
							placeholder='Nhập nội dung đánh giá...'
							showCount
							maxLength={500}
						/>
					</Form.Item>

					<Form.Item>
						<Space>
							<Button onClick={() => setShowAddModal(false)}>Hủy</Button>
							<Button type='primary' htmlType='submit' loading={isAdding}>
								{isAdding ? 'Đang thêm...' : 'Thêm đánh giá'}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>

			{/* Star Customer Detail Modal */}
			<Modal
				open={showDetailModal}
				title='Chi tiết đánh giá'
				onCancel={() => setShowDetailModal(false)}
				footer={<Button onClick={() => setShowDetailModal(false)}>Đóng</Button>}
				width={600}
			>
				{selectedStarCustomer && (
					<div>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<strong>Tên khách hàng:</strong>
								<div style={{ marginTop: '8px' }}>
									{selectedStarCustomer.name_customer}
								</div>
							</Col>
							<Col span={24}>
								<strong>Đánh giá:</strong>
								<div style={{ marginTop: '8px' }}>
									<Rate disabled defaultValue={selectedStarCustomer.star} />
									<span style={{ marginLeft: '8px' }}>
										({selectedStarCustomer.star}/5)
									</span>
								</div>
							</Col>
							<Col span={24}>
								<strong>Ngày tạo:</strong>
								<div style={{ marginTop: '8px' }}>
									{formatDate(selectedStarCustomer.created_at)}
								</div>
							</Col>
							<Col span={24}>
								<strong>Nội dung:</strong>
								<div
									style={{
										marginTop: '8px',
										padding: '12px',
										backgroundColor: '#f5f5f5',
										borderRadius: '6px',
									}}
								>
									{selectedStarCustomer.content ||
										'Không có nội dung đánh giá.'}
								</div>
							</Col>
						</Row>
					</div>
				)}
			</Modal>
		</div>
	);
};
