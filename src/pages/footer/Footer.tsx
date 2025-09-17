import { useState } from 'react';
import { useApi } from '../../services';
import { FooterLinkService } from '../../services/footerLinkService';
import { useAuthStore } from '../../store/authStore';
import { handleApiError, checkAuthentication } from '../../utils/errorHandler';
import type { FooterLink, FooterLinkCreateRequest } from '../../interfaces';
import { MainLayout } from '../../layouts';
import {
	Card,
	Button,
	Modal,
	Form,
	Select,
	Space,
	Typography,
	Divider,
	Row,
	Col,
	Tag,
	Popconfirm,
	message,
	Empty,
	Input,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	LinkOutlined,
	ExportOutlined,
} from '@ant-design/icons';
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
	}>('/company/footer-links');

	// Extract footer links array from API response
	const footerLinks = footerLinksResponse?.data || [];

	// Group links by column
	const groupedLinks = Array.isArray(footerLinks)
		? footerLinks.reduce((acc, link) => {
				const column = link.column_position;
				if (!acc[column]) {
					acc[column] = [];
				}
				acc[column].push(link);
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
			column_position: link.column_position,
			title_column: link.title_column || '',
		});
		setShowCreateModal(true);
	};

	// Handle create new
	const handleCreateNew = () => {
		setEditingLink(null);
		form.resetFields();
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
						style={{ marginBottom: 24 }}
					>
						<Col>
							<Title level={2} style={{ margin: 0 }}>
								<LinkOutlined /> Quản lý Footer Links
							</Title>
						</Col>
						<Col>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={handleCreateNew}
								size='large'
							>
								Thêm Link Mới
							</Button>
						</Col>
					</Row>

					<Divider orientation='left'>
						<Title level={3}>Preview Footer</Title>
					</Divider>

					<Row gutter={[16, 16]}>
						{[1, 2, 3, 4].map(columnNumber => (
							<Col xs={24} sm={12} md={6} key={columnNumber}>
								<Card
									size='small'
									title={
										<Space>
											<Text strong>Cột {columnNumber}</Text>
											<Tag color='blue'>
												{groupedLinks[columnNumber]?.length || 0} links
											</Tag>
										</Space>
									}
									extra={
										groupedLinks[columnNumber]?.[0]?.title_column && (
											<Tag color='green'>
												{groupedLinks[columnNumber][0].title_column}
											</Tag>
										)
									}
								>
									{groupedLinks[columnNumber]?.length > 0 ? (
										<Space direction='vertical' style={{ width: '100%' }}>
											{groupedLinks[columnNumber].map(link => (
												<Card
													key={link.id}
													size='small'
													style={{ marginBottom: 8 }}
													actions={[
														<Button
															type='text'
															icon={<EditOutlined />}
															onClick={() => handleEdit(link)}
															size='small'
														>
															Sửa
														</Button>,
														<Popconfirm
															title='Xóa footer link'
															description={`Bạn có chắc chắn muốn xóa link "${link.title}"?`}
															onConfirm={() => handleDelete(link)}
															okText='Có'
															cancelText='Không'
														>
															<Button
																type='text'
																danger
																icon={<DeleteOutlined />}
																size='small'
																loading={isLoading}
															>
																Xóa
															</Button>
														</Popconfirm>,
													]}
												>
													<Space direction='vertical' style={{ width: '100%' }}>
														<Text strong>{link.title}</Text>
														<a
															href={link.url}
															target='_blank'
															rel='noopener noreferrer'
															style={{ fontSize: '12px' }}
														>
															<ExportOutlined /> {link.url}
														</a>
													</Space>
												</Card>
											))}
										</Space>
									) : (
										<Empty
											image={Empty.PRESENTED_IMAGE_SIMPLE}
											description='Chưa có link nào'
											style={{ margin: '16px 0' }}
										/>
									)}
								</Card>
							</Col>
						))}
					</Row>
				</Card>

				{/* Modal for Create/Edit */}
				<Modal
					open={showCreateModal}
					onCancel={handleCloseModal}
					title={
						<Space>
							{editingLink ? <EditOutlined /> : <PlusOutlined />}
							{editingLink ? 'Chỉnh sửa Footer Link' : 'Thêm Footer Link Mới'}
						</Space>
					}
					footer={null}
					width={600}
				>
					<Form
						form={form}
						layout='vertical'
						onFinish={handleSubmit}
						initialValues={{
							column_position: 1,
						}}
					>
						<Form.Item
							label='Tiêu đề'
							name='title'
							rules={[
								{ required: true, message: 'Vui lòng nhập tiêu đề link!' },
							]}
						>
							<Input placeholder='Nhập tiêu đề link' />
						</Form.Item>

						<Form.Item
							label='URL'
							name='url'
							rules={[
								{ required: true, message: 'Vui lòng nhập URL!' },
								{ type: 'url', message: 'URL không hợp lệ!' },
							]}
						>
							<Input placeholder='Nhập URL (VD: https://example.com)' />
						</Form.Item>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label='Cột hiển thị'
									name='column_position'
									rules={[{ required: true, message: 'Vui lòng chọn cột!' }]}
								>
									<Select placeholder='Chọn cột hiển thị'>
										<Option value={1}>Cột 1</Option>
										<Option value={2}>Cột 2</Option>
										<Option value={3}>Cột 3</Option>
										<Option value={4}>Cột 4</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Tiêu đề cột (tùy chọn)' name='title_column'>
									<Input placeholder='VD: Dịch vụ, Chính sách...' />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
							<Space>
								<Button onClick={handleCloseModal}>Hủy</Button>
								<Button type='primary' htmlType='submit' loading={isLoading}>
									{editingLink ? 'Cập nhật' : 'Tạo mới'}
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</MainLayout>
	);
};

export default Footer;
