import {
	DeleteOutlined,
	EditOutlined,
	LinkOutlined,
	PlusOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Empty,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Tag,
	Typography,
	message,
} from 'antd';
import { useState } from 'react';
import type {
	FooterColumn,
	FooterLink,
	FooterLinkCreateRequest,
} from '../../interfaces';
import { MainLayout } from '../../layouts';
import { useApi } from '../../services';
import { FooterLinkService } from '../../services/footerLinkService';
import { useAuthStore } from '../../store/authStore';
import { checkAuthentication, handleApiError } from '../../utils/errorHandler';
import './Footer.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Footer = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
	const [form] = Form.useForm();

	// Auth info
	const { isAuthenticated, token } = useAuthStore();

	// Fetch data
	const { data: footerLinksResponse, mutate: mutateFooterLinks } = useApi<{
		isSuccess: boolean;
		message: string;
		data: FooterLink[];
	}>('/footer-links');

	const { data: footerColumnsResponse } = useApi<{
		isSuccess: boolean;
		message: string;
		data: FooterColumn[];
	}>('/footer-columns');

	// Extract arrays from API response
	const footerLinks = footerLinksResponse?.data || [];
	const footerColumns = footerColumnsResponse?.data || [];

	// Group links by column
	const groupedLinks = Array.isArray(footerLinks)
		? footerLinks.reduce((acc, link) => {
				const columnId = link.footerColumnId;
				if (columnId && !acc[columnId]) {
					acc[columnId] = [];
				}
				if (columnId) {
					acc[columnId].push(link);
				}
				return acc;
		  }, {} as Record<number, FooterLink[]>)
		: {};

	// Handle create/update
	const handleSubmit = async (values: FooterLinkCreateRequest) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			if (editingLink) {
				await FooterLinkService.updateFooterLink(
					editingLink.id!.toString(),
					values,
				);
				message.success('Cập nhật footer link thành công!');
			} else {
				await FooterLinkService.createFooterLink(values);
				message.success('Tạo footer link thành công!');
			}

			mutateFooterLinks();
			handleCloseModal();
		} catch (error: unknown) {
			handleApiError(
				error,
				editingLink
					? 'Lỗi khi cập nhật footer link'
					: 'Lỗi khi tạo footer link',
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle delete
	const handleDelete = async (link: FooterLink) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await FooterLinkService.deleteFooterLink(link.id!.toString());
			message.success('Xóa footer link thành công!');
			mutateFooterLinks();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi xóa footer link');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle edit
	const handleEdit = (link: FooterLink) => {
		setEditingLink(link);
		form.setFieldsValue({
			title: link.title,
			url: link.url,
			footerColumnId: link.footerColumnId,
			orderPosition: link.orderPosition || 0,
		});
		setShowCreateModal(true);
	};

	// Handle create new
	const handleCreateNew = () => {
		setEditingLink(null);
		form.resetFields();
		// Set default orderPosition
		form.setFieldsValue({ orderPosition: 0 });
		setShowCreateModal(true);
	};

	// Handle close modal
	const handleCloseModal = () => {
		setShowCreateModal(false);
		setEditingLink(null);
		form.resetFields();
	};

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
								<LinkOutlined /> Quản lý Footer Links
							</Title>
							<Text type='secondary'>
								Quản lý các liên kết trong footer của website
							</Text>
						</Col>
						<Col>
							<Space>
								<Button
									icon={<SettingOutlined />}
									onClick={() => window.open('/admin/footer-columns', '_blank')}
								>
									Quản lý cột
								</Button>
								<Button
									type='primary'
									icon={<PlusOutlined />}
									onClick={handleCreateNew}
									size='large'
								>
									Thêm link mới
								</Button>
							</Space>
						</Col>
					</Row>

					{footerColumns.length === 0 ? (
						<Empty
							description='Chưa có cột footer nào'
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						>
							<Button
								type='primary'
								icon={<SettingOutlined />}
								onClick={() => window.open('/admin/footer-columns', '_blank')}
							>
								Tạo cột footer đầu tiên
							</Button>
						</Empty>
					) : (
						<Row gutter={[16, 16]}>
							{footerColumns
								.sort((a, b) => a.position - b.position)
								.map(column => (
									<Col xs={24} sm={12} md={8} lg={6} key={column.id}>
										<Card
											size='small'
											title={
												<Space>
													<Tag color='blue'>Cột #{column.position}</Tag>
													{column.title}
												</Space>
											}
											extra={
												<Tag color='green'>
													{groupedLinks[column.id]?.length || 0} links
												</Tag>
											}
										>
											{groupedLinks[column.id]?.length > 0 ? (
												<Space direction='vertical' style={{ width: '100%' }}>
													{groupedLinks[column.id]
														.sort(
															(a, b) =>
																(a.orderPosition || 0) - (b.orderPosition || 0),
														)
														.map(link => (
															<Card
																key={link.id}
																size='small'
																style={{ marginBottom: '8px' }}
															>
																<Row justify='space-between' align='middle'>
																	<Col flex='auto'>
																		<div>
																			<Text strong>{link.title}</Text>
																			<br />
																			<Text
																				type='secondary'
																				style={{ fontSize: '12px' }}
																			>
																				{link.url}
																			</Text>
																			<br />
																			<Tag color='orange'>
																				Vị trí: {link.orderPosition || 0}
																			</Tag>
																		</div>
																	</Col>
																	<Col>
																		<Space direction='vertical' size='small'>
																			<Button
																				type='primary'
																				size='small'
																				icon={<EditOutlined />}
																				onClick={() => handleEdit(link)}
																			/>
																			<Popconfirm
																				title='Xóa link'
																				description='Bạn có chắc chắn muốn xóa link này không?'
																				onConfirm={() => handleDelete(link)}
																				okText='Có'
																				cancelText='Không'
																			>
																				<Button
																					danger
																					size='small'
																					icon={<DeleteOutlined />}
																				/>
																			</Popconfirm>
																		</Space>
																	</Col>
																</Row>
															</Card>
														))}
												</Space>
											) : (
												<Empty
													description='Chưa có link nào'
													image={Empty.PRESENTED_IMAGE_SIMPLE}
													style={{ margin: '16px 0' }}
												>
													<Button
														type='dashed'
														size='small'
														icon={<PlusOutlined />}
														onClick={handleCreateNew}
													>
														Thêm link
													</Button>
												</Empty>
											)}
										</Card>
									</Col>
								))}
						</Row>
					)}
				</Card>

				{/* Create/Edit Modal */}
				<Modal
					title={editingLink ? 'Chỉnh sửa Footer Link' : 'Thêm Footer Link mới'}
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
							label='Tiêu đề link'
							name='title'
							rules={[
								{ required: true, message: 'Vui lòng nhập tiêu đề link!' },
								{ min: 2, message: 'Tiêu đề phải có ít nhất 2 ký tự!' },
							]}
						>
							<Input placeholder='Nhập tiêu đề link...' />
						</Form.Item>

						<Form.Item
							label='URL'
							name='url'
							rules={[
								{ required: true, message: 'Vui lòng nhập URL!' },
								{ type: 'url', message: 'URL không hợp lệ!' },
							]}
						>
							<Input placeholder='https://example.com' />
						</Form.Item>

						<Form.Item
							label='Cột footer'
							name='footerColumnId'
							rules={[{ required: true, message: 'Vui lòng chọn cột footer!' }]}
						>
							<Select placeholder='Chọn cột footer'>
								{footerColumns
									.sort((a, b) => a.position - b.position)
									.map(column => (
										<Option key={column.id} value={column.id}>
											Cột #{column.position} - {column.title}
										</Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item
							label='Vị trí trong cột'
							name='orderPosition'
							rules={[
								{
									type: 'number',
									min: 0,
									message: 'Vị trí phải lớn hơn hoặc bằng 0!',
								},
							]}
						>
							<InputNumber
								placeholder='Vị trí sắp xếp trong cột (0, 1, 2...)'
								style={{ width: '100%' }}
								min={0}
							/>
						</Form.Item>

						<div style={{ textAlign: 'right', marginTop: '24px' }}>
							<Space>
								<Button onClick={handleCloseModal}>Hủy</Button>
								<Button type='primary' htmlType='submit' loading={isLoading}>
									{editingLink ? 'Cập nhật' : 'Tạo mới'}
								</Button>
							</Space>
						</div>
					</Form>
				</Modal>
			</div>
		</MainLayout>
	);
};

export default Footer;
