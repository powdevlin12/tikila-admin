import React, { useState } from 'react';
import {
	Table,
	Button,
	Space,
	Popconfirm,
	Tag,
	Card,
	Row,
	Col,
	message,
	Modal,
	Form,
	Input,
	Select,
	DatePicker,
	InputNumber,
	Statistic,
	Alert,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	FilterOutlined,
	WarningOutlined,
	ReloadOutlined,
	CloseOutlined,
} from '@ant-design/icons';
import './ServiceRegistrations.css';
import { useApi } from '../../services/hooks';
import { ServiceRegistrationService } from '../../services';
import { useAuthStore } from '../../store';
import type {
	ServiceRegistration,
	CreateServiceRegistrationRequest,
	UpdateServiceRegistrationRequest,
	ServiceRegistrationFilter,
} from '../../interfaces';
import { checkAuthentication, handleApiError } from '../../utils';
import type { Dayjs } from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ServiceRegistrations: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [editingRegistration, setEditingRegistration] =
		useState<ServiceRegistration | null>(null);
	const [filters, setFilters] = useState<ServiceRegistrationFilter>({});
	const [createForm] = Form.useForm();
	const [editForm] = Form.useForm();
	const [filterForm] = Form.useForm();

	// Auth info
	const { isAuthenticated, token } = useAuthStore();

	// Fetch data với filters
	const { data: registrationsResponse, mutate: mutateRegistrations } = useApi<{
		success: boolean;
		message: string;
		data: {
			data: ServiceRegistration[];
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	}>(
		`/service-registrations?${new URLSearchParams(
			filters as Record<string, string>,
		).toString()}`,
	);

	// Fetch statistics
	const { data: statsResponse } = useApi<{
		success: boolean;
		message: string;
		data: {
			total: number;
			active: number;
			expired: number;
			cancelled: number;
			expiring_soon: number;
		};
	}>('/service-registrations/stats/overview');

	// Extract data from API response
	const registrations = registrationsResponse?.data?.data || [];
	const pagination = registrationsResponse?.data || {
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	};
	const stats = statsResponse?.data || {
		total: 0,
		active: 0,
		expired: 0,
		cancelled: 0,
		expiring_soon: 0,
	};

	// Handle create service registration
	const handleCreateRegistration = async (
		values: CreateServiceRegistrationRequest,
	) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		try {
			setIsLoading(true);
			await ServiceRegistrationService.createServiceRegistration(values);
			message.success('Tạo đăng ký dịch vụ thành công');
			setCreateModalVisible(false);
			createForm.resetFields();
			mutateRegistrations();
		} catch (error) {
			handleApiError(error, 'Lỗi khi tạo đăng ký dịch vụ');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle edit service registration
	const handleEditRegistration = async (
		values: UpdateServiceRegistrationRequest,
	) => {
		if (!checkAuthentication(isAuthenticated, token) || !editingRegistration) {
			return;
		}

		try {
			setIsLoading(true);
			await ServiceRegistrationService.updateServiceRegistration(
				editingRegistration.id,
				values,
			);
			message.success('Cập nhật đăng ký dịch vụ thành công');
			setEditModalVisible(false);
			setEditingRegistration(null);
			editForm.resetFields();
			mutateRegistrations();
		} catch (error) {
			handleApiError(error, 'Lỗi khi cập nhật đăng ký dịch vụ');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle delete service registration
	const handleDeleteRegistration = async (
		registration: ServiceRegistration,
	) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		try {
			setIsLoading(true);
			await ServiceRegistrationService.deleteServiceRegistration(
				registration.id,
			);
			message.success('Xóa đăng ký dịch vụ thành công');
			mutateRegistrations();
		} catch (error) {
			handleApiError(error, 'Lỗi khi xóa đăng ký dịch vụ');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle filter
	const handleFilter = (values: {
		status?: string;
		expiring_in_days?: number;
		date_range?: [Dayjs, Dayjs];
	}) => {
		const newFilters: ServiceRegistrationFilter = {};

		if (values.status) newFilters.status = values.status;
		if (values.expiring_in_days)
			newFilters.expiring_in_days = values.expiring_in_days;
		if (values.date_range && values.date_range.length === 2) {
			newFilters.start_date = values.date_range[0].format('YYYY-MM-DD');
			newFilters.end_date = values.date_range[1].format('YYYY-MM-DD');
		}

		setFilters(newFilters);
		setFilterModalVisible(false);
		mutateRegistrations();
	};

	// Clear filters
	const clearFilters = () => {
		setFilters({});
		filterForm.resetFields();
		setFilterModalVisible(false);
		mutateRegistrations();
	};

	// Remove individual filter
	const removeFilter = (filterKey: keyof ServiceRegistrationFilter) => {
		const newFilters = { ...filters };
		delete newFilters[filterKey];

		// If removing date range, also remove start_date and end_date
		if (filterKey === 'start_date' || filterKey === 'end_date') {
			delete newFilters.start_date;
			delete newFilters.end_date;
		}

		setFilters(newFilters);
		mutateRegistrations();
	};

	// Get filter display text
	const getFilterDisplayText = (
		key: string,
		value: string | number,
	): string => {
		switch (key) {
			case 'status':
				return ServiceRegistrationService.getStatusLabel(value as string);
			case 'expiring_in_days':
				return `Sắp hết hạn trong ${value} ngày`;
			case 'start_date': {
				const endDate = filters.end_date;
				return `Từ ${ServiceRegistrationService.formatDate(
					value as string,
				)} đến ${ServiceRegistrationService.formatDate(
					endDate || (value as string),
				)}`;
			}
			default:
				return String(value);
		}
	};

	// Check if any filters are active
	const hasActiveFilters = Object.keys(filters).length > 0;

	// Open edit modal
	const openEditModal = (registration: ServiceRegistration) => {
		setEditingRegistration(registration);
		editForm.setFieldsValue({
			customer_name: registration.customer_name,
			phone: registration.phone,
			address: registration.address,
			notes: registration.notes,
			duration_months: registration.duration_months,
			status: registration.status,
		});
		setEditModalVisible(true);
	};

	// Table columns
	const columns = [
		{
			title: 'Tên khách hàng',
			dataIndex: 'customer_name',
			key: 'customer_name',
			width: 200,
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
			width: 120,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'address',
			key: 'address',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Thời gian',
			dataIndex: 'duration_months',
			key: 'duration_months',
			width: 100,
			render: (months: number) => `${months} tháng`,
		},
		{
			title: 'Ngày đăng ký',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 120,
			render: (date: string) => ServiceRegistrationService.formatDate(date),
		},
		{
			title: 'Ngày kết thúc',
			dataIndex: 'end_date',
			key: 'end_date',
			width: 120,
			render: (date: string) => ServiceRegistrationService.formatDate(date),
		},
		{
			title: 'Còn lại',
			dataIndex: 'end_date',
			key: 'days_left',
			width: 100,
			render: (endDate: string) => {
				const daysLeft =
					ServiceRegistrationService.calculateDaysUntilExpiration(endDate);
				let color = 'green';
				if (daysLeft <= 0) color = 'red';
				else if (daysLeft <= 30) color = 'orange';

				return (
					<Tag color={color}>
						{daysLeft <= 0 ? 'Đã hết hạn' : `${daysLeft} ngày`}
					</Tag>
				);
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: string) => (
				<Tag color={ServiceRegistrationService.getStatusColor(status)}>
					{ServiceRegistrationService.getStatusLabel(status)}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 150,
			render: (_: unknown, record: ServiceRegistration) => (
				<Space size='small'>
					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => openEditModal(record)}
						size='small'
					/>
					<Popconfirm
						title='Xác nhận xóa'
						description='Bạn có chắc chắn muốn xóa đăng ký này?'
						onConfirm={() => handleDeleteRegistration(record)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button type='text' icon={<DeleteOutlined />} danger size='small' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='service-registrations-page'>
			{/* Statistics Cards */}
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng số đăng ký' value={stats.total} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đang hoạt động'
							value={stats.active}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Sắp hết hạn'
							value={stats.expiring_soon}
							valueStyle={{ color: '#cf1322' }}
							prefix={<WarningOutlined />}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đã hết hạn'
							value={stats.expired}
							valueStyle={{ color: '#cf1322' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Alert for expiring soon */}
			{stats.expiring_soon > 0 && (
				<Alert
					message={`Có ${stats.expiring_soon} đăng ký sắp hết hạn trong 30 ngày tới`}
					type='warning'
					showIcon
					style={{ marginBottom: 16 }}
				/>
			)}

			{/* Main Content Card */}
			<Card>
				<div className='page-header'>
					<div className='page-title'>
						<h2>Quản lý đăng ký dịch vụ</h2>
					</div>
					<div className='page-actions'>
						<Space>
							<Button
								icon={<FilterOutlined />}
								onClick={() => setFilterModalVisible(true)}
								type={hasActiveFilters ? 'primary' : 'default'}
								style={{
									backgroundColor: hasActiveFilters ? '#3b82f6' : undefined,
									borderColor: hasActiveFilters ? '#3b82f6' : undefined,
									color: hasActiveFilters ? '#ffffff' : undefined,
								}}
							>
								Lọc{' '}
								{hasActiveFilters &&
									`(${
										Object.keys(filters).filter(
											key => key !== 'end_date' || !filters.start_date,
										).length
									})`}
							</Button>
							<Button
								icon={<ReloadOutlined />}
								onClick={() => mutateRegistrations()}
							>
								Tải lại
							</Button>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => setCreateModalVisible(true)}
							>
								Thêm đăng ký
							</Button>
						</Space>
					</div>
				</div>

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<div className='active-filters' style={{ marginBottom: 16 }}>
						<div className='filter-label'>
							<strong>Đang lọc: </strong>
						</div>
						<Space wrap>
							{Object.entries(filters).map(([key, value]) => {
								// Don't show end_date separately if start_date is present
								if (key === 'end_date' && filters.start_date) {
									return null;
								}

								return (
									<Tag
										key={key}
										closable
										onClose={() =>
											removeFilter(key as keyof ServiceRegistrationFilter)
										}
										color='blue'
									>
										{getFilterDisplayText(key, value as string | number)}
									</Tag>
								);
							})}
							<Button
								type='link'
								size='small'
								onClick={clearFilters}
								style={{ padding: 0 }}
							>
								Xóa tất cả
							</Button>
						</Space>
					</div>
				)}

				{/* No filters message */}
				{!hasActiveFilters && (
					<div
						style={{
							marginBottom: 16,
							padding: '8px 0',
							color: '#6b7280',
							fontSize: '14px',
						}}
					>
						Hiển thị tất cả đăng ký dịch vụ
					</div>
				)}

				<Table
					columns={columns}
					dataSource={registrations}
					rowKey='id'
					loading={isLoading}
					pagination={{
						current: pagination.page,
						pageSize: pagination.limit,
						total: pagination.total,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} của ${total} mục`,
					}}
					scroll={{ x: 1200 }}
				/>
			</Card>

			{/* Create Modal */}
			<Modal
				title='Thêm đăng ký dịch vụ mới'
				open={createModalVisible}
				onOk={() => createForm.submit()}
				onCancel={() => {
					setCreateModalVisible(false);
					createForm.resetFields();
				}}
				confirmLoading={isLoading}
				width={600}
			>
				<Form
					form={createForm}
					layout='vertical'
					onFinish={handleCreateRegistration}
				>
					<Form.Item
						name='customer_name'
						label='Tên khách hàng'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên khách hàng' },
						]}
					>
						<Input placeholder='Nhập tên khách hàng' />
					</Form.Item>

					<Form.Item
						name='phone'
						label='Số điện thoại'
						rules={[
							{ required: true, message: 'Vui lòng nhập số điện thoại' },
							{
								pattern: /^[0-9]{10,11}$/,
								message: 'Số điện thoại không hợp lệ',
							},
						]}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>

					<Form.Item name='address' label='Địa chỉ'>
						<Input.TextArea rows={2} placeholder='Nhập địa chỉ' />
					</Form.Item>

					<Form.Item
						name='duration_months'
						label='Thời gian sử dụng (tháng)'
						rules={[
							{ required: true, message: 'Vui lòng nhập thời gian sử dụng' },
						]}
					>
						<InputNumber
							min={1}
							max={60}
							placeholder='Số tháng'
							style={{ width: '100%' }}
						/>
					</Form.Item>

					<Form.Item name='notes' label='Ghi chú'>
						<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
					</Form.Item>
				</Form>
			</Modal>

			{/* Edit Modal */}
			<Modal
				title='Chỉnh sửa đăng ký dịch vụ'
				open={editModalVisible}
				onOk={() => editForm.submit()}
				onCancel={() => {
					setEditModalVisible(false);
					setEditingRegistration(null);
					editForm.resetFields();
				}}
				confirmLoading={isLoading}
				width={600}
			>
				<Form
					form={editForm}
					layout='vertical'
					onFinish={handleEditRegistration}
				>
					<Form.Item
						name='customer_name'
						label='Tên khách hàng'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên khách hàng' },
						]}
					>
						<Input placeholder='Nhập tên khách hàng' />
					</Form.Item>

					<Form.Item
						name='phone'
						label='Số điện thoại'
						rules={[
							{ required: true, message: 'Vui lòng nhập số điện thoại' },
							{
								pattern: /^[0-9]{10,11}$/,
								message: 'Số điện thoại không hợp lệ',
							},
						]}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>

					<Form.Item name='address' label='Địa chỉ'>
						<Input.TextArea rows={2} placeholder='Nhập địa chỉ' />
					</Form.Item>

					<Form.Item
						name='duration_months'
						label='Thời gian sử dụng (tháng)'
						rules={[
							{ required: true, message: 'Vui lòng nhập thời gian sử dụng' },
						]}
					>
						<InputNumber
							min={1}
							max={60}
							placeholder='Số tháng'
							style={{ width: '100%' }}
						/>
					</Form.Item>

					<Form.Item
						name='status'
						label='Trạng thái'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
					>
						<Select placeholder='Chọn trạng thái'>
							<Option value='active'>Đang hoạt động</Option>
							<Option value='expired'>Đã hết hạn</Option>
							<Option value='cancelled'>Đã hủy</Option>
						</Select>
					</Form.Item>

					<Form.Item name='notes' label='Ghi chú'>
						<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
					</Form.Item>
				</Form>
			</Modal>

			{/* Filter Modal */}
			<Modal
				title='Lọc đăng ký dịch vụ'
				open={filterModalVisible}
				onOk={() => filterForm.submit()}
				onCancel={() => setFilterModalVisible(false)}
				footer={[
					<Button key='clear' onClick={clearFilters}>
						Xóa bộ lọc
					</Button>,
					<Button key='cancel' onClick={() => setFilterModalVisible(false)}>
						Hủy
					</Button>,
					<Button
						key='submit'
						type='primary'
						onClick={() => filterForm.submit()}
					>
						Áp dụng
					</Button>,
				]}
			>
				<Form form={filterForm} layout='vertical' onFinish={handleFilter}>
					<Form.Item name='status' label='Trạng thái'>
						<Select placeholder='Chọn trạng thái' allowClear>
							<Option value='active'>Đang hoạt động</Option>
							<Option value='expired'>Đã hết hạn</Option>
							<Option value='cancelled'>Đã hủy</Option>
						</Select>
					</Form.Item>

					<Form.Item name='expiring_in_days' label='Sắp hết hạn trong'>
						<Select placeholder='Chọn số ngày' allowClear>
							<Option value={7}>7 ngày</Option>
							<Option value={15}>15 ngày</Option>
							<Option value={30}>30 ngày</Option>
							<Option value={60}>60 ngày</Option>
						</Select>
					</Form.Item>

					<Form.Item name='date_range' label='Khoảng thời gian đăng ký'>
						<RangePicker
							style={{ width: '100%' }}
							placeholder={['Từ ngày', 'Đến ngày']}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ServiceRegistrations;
