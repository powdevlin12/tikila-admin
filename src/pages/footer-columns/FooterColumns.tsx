import { useState } from 'react';
import { useApi } from '../../services';
import { FooterColumnService } from '../../services/footerColumnService';
import { useAuthStore } from '../../store/authStore';
import { handleApiError, checkAuthentication } from '../../utils/errorHandler';
import type { FooterColumn, CreateFooterColumnDto } from '../../interfaces';
import { MainLayout } from '../../layouts';
import {
	Card,
	Button,
	Modal,
	Form,
	Space,
	Typography,
	Row,
	Col,
	Tag,
	Popconfirm,
	message,
	Empty,
	Input,
	InputNumber,
	Table,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const FooterColumns = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingColumn, setEditingColumn] = useState<FooterColumn | null>(null);
	const [form] = Form.useForm();

	// Auth info
	const { isAuthenticated, token } = useAuthStore();

	// Fetch data
	const { data: footerColumnsResponse, mutate: mutateFooterColumns } = useApi<{
		isSuccess: boolean;
		message: string;
		data: FooterColumn[];
	}>('/footer-columns');

	// Extract footer columns array from API response
	const footerColumns = footerColumnsResponse?.data || [];

	// Handle create/update
	const handleSubmit = async (values: CreateFooterColumnDto) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			if (editingColumn) {
				await FooterColumnService.updateFooterColumn(
					editingColumn.id.toString(),
					values,
				);
				message.success('Cập nhật cột footer thành công!');
			} else {
				await FooterColumnService.createFooterColumn(values);
				message.success('Tạo cột footer thành công!');
			}

			mutateFooterColumns();
			handleCloseModal();
		} catch (error: unknown) {
			handleApiError(
				error,
				editingColumn
					? 'Lỗi khi cập nhật cột footer'
					: 'Lỗi khi tạo cột footer',
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle delete
	const handleDelete = async (column: FooterColumn) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await FooterColumnService.deleteFooterColumn(column.id.toString());
			message.success('Xóa cột footer thành công!');
			mutateFooterColumns();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi xóa cột footer');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle edit
	const handleEdit = (column: FooterColumn) => {
		setEditingColumn(column);
		form.setFieldsValue({
			title: column.title,
			position: column.position,
		});
		setShowCreateModal(true);
	};

	// Handle create new
	const handleCreateNew = () => {
		setEditingColumn(null);
		form.resetFields();
		setShowCreateModal(true);
	};

	// Handle close modal
	const handleCloseModal = () => {
		setShowCreateModal(false);
		setEditingColumn(null);
		form.resetFields();
	};

	// Table columns
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 80,
		},
		{
			title: 'Tiêu đề cột',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Vị trí',
			dataIndex: 'position',
			key: 'position',
			width: 100,
			render: (position: number) => <Tag color='blue'>#{position}</Tag>,
		},
		{
			title: 'Số lượng links',
			key: 'linkCount',
			width: 120,
			render: (_, record: FooterColumn) => (
				<Tag color='green'>{record.footerLinks?.length || 0} links</Tag>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 150,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 150,
			render: (_, record: FooterColumn) => (
				<Space size='small'>
					<Button
						type='primary'
						size='small'
						icon={<EditOutlined />}
						onClick={() => handleEdit(record)}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa cột footer'
						description='Bạn có chắc chắn muốn xóa cột footer này không?'
						onConfirm={() => handleDelete(record)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger size='small' icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<MainLayout>
			<div style={{ padding: '24px', width: 'calc(100vw - 320px)' }}>
				<Card>
					<Row
						justify='space-between'
						align='middle'
						style={{ marginBottom: '16px' }}
					>
						<Col>
							<Title level={3} style={{ margin: 0 }}>
								<UnorderedListOutlined /> Quản lý cột Footer
							</Title>
							<Text type='secondary'>
								Quản lý các cột trong footer của website
							</Text>
						</Col>
						<Col>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={handleCreateNew}
								size='large'
							>
								Thêm cột mới
							</Button>
						</Col>
					</Row>

					{Array.isArray(footerColumns) && footerColumns.length > 0 ? (
						<Table
							dataSource={footerColumns}
							columns={columns}
							rowKey='id'
							loading={isLoading}
							pagination={{
								pageSize: 10,
								showSizeChanger: true,
								showQuickJumper: true,
								showTotal: (total, range) =>
									`${range[0]}-${range[1]} của ${total} cột`,
							}}
						/>
					) : (
						<Empty
							description='Chưa có cột footer nào'
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={handleCreateNew}
							>
								Tạo cột đầu tiên
							</Button>
						</Empty>
					)}
				</Card>

				{/* Create/Edit Modal */}
				<Modal
					title={editingColumn ? 'Chỉnh sửa cột Footer' : 'Thêm cột Footer mới'}
					open={showCreateModal}
					onCancel={handleCloseModal}
					footer={null}
					width={600}
				>
					<Form
						form={form}
						layout='vertical'
						onFinish={handleSubmit}
						requiredMark={false}
					>
						<Form.Item
							label='Tiêu đề cột'
							name='title'
							rules={[
								{ required: true, message: 'Vui lòng nhập tiêu đề cột!' },
								{ min: 2, message: 'Tiêu đề phải có ít nhất 2 ký tự!' },
							]}
						>
							<Input placeholder='Nhập tiêu đề cột footer...' />
						</Form.Item>

						<Form.Item
							label='Vị trí'
							name='position'
							rules={[
								{ required: true, message: 'Vui lòng nhập vị trí!' },
								{ type: 'number', min: 1, message: 'Vị trí phải lớn hơn 0!' },
							]}
						>
							<InputNumber
								placeholder='Nhập vị trí cột (1, 2, 3...)'
								style={{ width: '100%' }}
								min={1}
							/>
						</Form.Item>

						<div style={{ textAlign: 'right', marginTop: '24px' }}>
							<Space>
								<Button onClick={handleCloseModal}>Hủy</Button>
								<Button type='primary' htmlType='submit' loading={isLoading}>
									{editingColumn ? 'Cập nhật' : 'Tạo mới'}
								</Button>
							</Space>
						</div>
					</Form>
				</Modal>
			</div>
		</MainLayout>
	);
};

export default FooterColumns;
