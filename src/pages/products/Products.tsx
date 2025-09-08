import React, { useState } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Space,
	Popconfirm,
	Tag,
	Card,
	Row,
	Col,
	Image,
	message,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	UploadOutlined,
	EyeOutlined,
	InboxOutlined,
} from '@ant-design/icons';
import { MainLayout } from '../../layouts';
import { useApi } from '../../services/hooks';
import { ProductService } from '../../services';
import { useAuthStore } from '../../store';
import type { Product } from '../../interfaces';
import { checkAuthentication, handleApiError } from '../../utils';
import './Products.css';

const { TextArea } = Input;

const Products: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showProductModal, setShowProductModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string>('');
	const [form] = Form.useForm();

	// Auth info
	const { isAuthenticated, token } = useAuthStore();

	// Fetch data
	const { data: products, mutate: mutateProducts } =
		useApi<Product[]>('/products');

	// Handle create/update product
	const handleSubmitProduct = async (values: {
		name: string;
		description: string;
		price: number;
		image_url?: string;
		status?: string;
	}) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			if (editingProduct) {
				// Update existing product
				if (uploadedFile) {
					// Update with image
					await ProductService.updateProductWithImage(editingProduct.id, {
						name: values.name,
						description: values.description,
						price: values.price,
						image: uploadedFile,
					});
				} else {
					// Update without image
					const productData = {
						name: values.name,
						description: values.description,
						price: values.price,
						image_url: values.image_url || '',
						// Note: Status is handled via soft delete, not update
					};
					await ProductService.updateProduct(editingProduct.id, productData);
				}
				message.success('Cập nhật sản phẩm thành công!');
			} else {
				// Create new product
				if (uploadedFile) {
					// Create with image upload
					await ProductService.createProductWithImage({
						name: values.name,
						description: values.description,
						price: values.price,
						image: uploadedFile,
					});
				} else {
					// Create with image URL only
					const productData = {
						name: values.name,
						description: values.description,
						price: values.price,
						image_url: values.image_url || '',
					};
					await ProductService.createProduct(productData);
				}
				message.success('Tạo sản phẩm thành công!');
			}

			mutateProducts();
			setShowProductModal(false);
			setEditingProduct(null);
			setUploadedFile(null);
			setPreviewImage('');
			form.resetFields();
		} catch (error: unknown) {
			handleApiError(
				error,
				editingProduct ? 'Lỗi khi cập nhật sản phẩm' : 'Lỗi khi tạo sản phẩm',
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle delete product
	const handleDeleteProduct = async (product: Product) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await ProductService.deleteProduct(product.id);
			message.success('Xóa sản phẩm thành công!');
			mutateProducts();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi xóa sản phẩm');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle image upload
	const handleImageUpload = async (file: File, productId: string) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await ProductService.updateProductWithImage(productId, { image: file });
			message.success('Cập nhật hình ảnh thành công!');
			mutateProducts();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi upload hình ảnh');
		} finally {
			setIsLoading(false);
		}
	};

	// Open edit modal
	const handleEditProduct = (product: Product) => {
		setEditingProduct(product);
		setUploadedFile(null);
		setPreviewImage('');
		form.setFieldsValue({
			name: product.title, // Backend uses 'title'
			description: product.description,
			// price: product.price,
			image_url: product.image_url,
			is_delete: product.is_delete,
			// Note: Status is controlled via is_delete field, not editable
		});
		setShowProductModal(true);
	};

	// Open create modal
	const handleCreateProduct = () => {
		setEditingProduct(null);
		setUploadedFile(null);
		setPreviewImage('');
		form.resetFields();
		setShowProductModal(true);
	};

	// Handle file upload
	const handleFileUpload = (file: File) => {
		setUploadedFile(file);

		// Create preview URL
		const reader = new FileReader();
		reader.onload = e => {
			setPreviewImage(e.target?.result as string);
		};
		reader.readAsDataURL(file);

		return false; // Prevent automatic upload
	};

	// Remove uploaded file
	const handleRemoveFile = () => {
		setUploadedFile(null);
		setPreviewImage('');
	};

	// Table columns
	const columns = [
		{
			title: 'Hình ảnh',
			dataIndex: 'image_url',
			key: 'image_url',
			width: 100,
			render: (imageUrl: string, record: Product) => (
				<div style={{ position: 'relative' }}>
					{imageUrl ? (
						<Image
							width={60}
							height={60}
							src={imageUrl}
							alt={record.title}
							style={{ objectFit: 'cover', borderRadius: '4px' }}
							preview={{
								mask: <EyeOutlined style={{ fontSize: '16px' }} />,
							}}
						/>
					) : (
						<div
							style={{
								width: 60,
								height: 60,
								backgroundColor: '#f5f5f5',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: '4px',
								border: '1px dashed #d9d9d9',
							}}
						>
							<UploadOutlined style={{ color: '#8c8c8c' }} />
						</div>
					)}
					<input
						type='file'
						accept='image/*'
						style={{ display: 'none' }}
						onChange={e => {
							const file = e.target.files?.[0];
							if (file) {
								handleImageUpload(file, record.id);
							}
						}}
						ref={ref => {
							if (ref) {
								ref.onclick = () => {
									ref.value = '';
								};
							}
						}}
					/>
					<Button
						size='small'
						icon={<UploadOutlined />}
						onClick={e => {
							e.stopPropagation();
							const input = (
								e.currentTarget.parentNode as HTMLElement
							)?.querySelector('input[type="file"]') as HTMLInputElement;
							input?.click();
						}}
						style={{
							position: 'absolute',
							top: '2px',
							right: '2px',
							opacity: 0.8,
							minWidth: '24px',
							height: '24px',
							padding: 0,
						}}
					/>
				</div>
			),
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'title',
			key: 'title',
			sorter: (a: Product, b: Product) => a.title.localeCompare(b.title),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
			render: (text: string) => (
				<div style={{ maxWidth: 200 }} title={text}>
					{text}
				</div>
			),
		},
		// {
		// 	title: 'Giá',
		// 	dataIndex: 'price',
		// 	key: 'price',
		// 	sorter: (a: Product, b: Product) => a.price - b.price,
		// 	render: (price: number) => (
		// 		<span style={{ fontWeight: 'bold', color: '#1890ff' }}>
		// 			{price?.toLocaleString('vi-VN')} VNĐ
		// 		</span>
		// 	),
		// },
		{
			title: 'Trạng thái',
			dataIndex: 'is_delete',
			key: 'is_delete',
			filters: [
				{ text: 'Hoạt động', value: 0 },
				{ text: 'Không hoạt động', value: 1 },
			],
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onFilter: (value: any, record: Product) => record.is_delete === value,
			render: (is_delete: number) => (
				<Tag color={is_delete === 0 ? 'green' : 'red'}>
					{is_delete === 0 ? 'Hoạt động' : 'Không hoạt động'}
				</Tag>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter: (a: Product, b: Product) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			render: (created_at: string) =>
				new Date(created_at).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 120,
			render: (_: unknown, record: Product) => (
				<Space size='small'>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEditProduct(record)}
						size='small'
					>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa sản phẩm này?'
						onConfirm={() => handleDeleteProduct(record)}
						okText='Có'
						cancelText='Không'
					>
						<Button type='link' danger icon={<DeleteOutlined />} size='small'>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	if (!products) {
		return (
			<MainLayout title='Products Management'>
				<div className='loading'>
					<div>Đang tải...</div>
					{!isAuthenticated && (
						<div style={{ marginTop: '20px' }}>
							<h3>Vui lòng đăng nhập để tiếp tục</h3>
						</div>
					)}
				</div>
			</MainLayout>
		);
	}

	return (
		<div className='products-page'>
			<Card>
				<Row
					justify='space-between'
					align='middle'
					style={{ marginBottom: 16 }}
				>
					<Col>
						<h2 style={{ margin: 0 }}>Quản lý sản phẩm</h2>
					</Col>
					<Col>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={handleCreateProduct}
							size='large'
						>
							Thêm sản phẩm mới
						</Button>
					</Col>
				</Row>

				<Table
					columns={columns}
					dataSource={products}
					rowKey='id'
					loading={isLoading}
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} của ${total} sản phẩm`,
					}}
					scroll={{ x: 800 }}
				/>
			</Card>

			{/* Product Modal */}
			<Modal
				title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
				open={showProductModal}
				onCancel={() => {
					setShowProductModal(false);
					setEditingProduct(null);
					setUploadedFile(null);
					setPreviewImage('');
					form.resetFields();
				}}
				footer={null}
				width={600}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={handleSubmitProduct}
					style={{ marginTop: 16 }}
				>
					<Form.Item
						name='name'
						label='Tên sản phẩm'
						rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
					>
						<Input placeholder='Nhập tên sản phẩm' size='large' />
					</Form.Item>

					<Form.Item
						name='description'
						label='Mô tả'
						rules={[
							{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' },
						]}
					>
						<TextArea rows={4} placeholder='Nhập mô tả sản phẩm' size='large' />
					</Form.Item>

					<Form.Item
						name='price'
						label='Giá (VNĐ)'
						rules={[
							{ required: true, message: 'Vui lòng nhập giá sản phẩm!' },
							{ type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' },
						]}
					>
						<InputNumber
							placeholder='Nhập giá sản phẩm'
							style={{ width: '100%' }}
							size='large'
							formatter={value =>
								`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							}
							parser={value => value!.replace(/\$\s?|(,*)/g, '')}
						/>
					</Form.Item>

					{/* Image Upload Section */}
					<Form.Item label='Hình ảnh sản phẩm'>
						<div>
							<div
								className='upload-area'
								onClick={() => document.getElementById('file-input')?.click()}
							>
								<InboxOutlined style={{ fontSize: '48px', color: '#ccc' }} />
								<p style={{ margin: '8px 0 4px' }}>
									Click hoặc kéo thả file để upload
								</p>
								<p style={{ margin: 0, color: '#999' }}>
									Hỗ trợ: JPG, PNG, GIF
								</p>
							</div>
							<input
								id='file-input'
								type='file'
								accept='image/*'
								style={{ display: 'none' }}
								onChange={e => {
									const file = e.target.files?.[0];
									if (file) {
										handleFileUpload(file);
									}
								}}
							/>
							{previewImage && (
								<div className='upload-preview'>
									<img src={previewImage} alt='Preview' />
									<div style={{ marginTop: '8px' }}>
										<Button type='link' danger onClick={handleRemoveFile}>
											Xóa ảnh
										</Button>
									</div>
								</div>
							)}
						</div>
					</Form.Item>

					<Form.Item name='image_url' label='Hoặc nhập URL hình ảnh'>
						<Input placeholder='Nhập URL hình ảnh (tùy chọn)' size='large' />
					</Form.Item>

					{/* Note: Status is controlled via soft delete, not editable */}

					<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
						<Space>
							<Button
								onClick={() => {
									setShowProductModal(false);
									setEditingProduct(null);
									setUploadedFile(null);
									setPreviewImage('');
									form.resetFields();
								}}
							>
								Hủy
							</Button>
							<Button
								type='primary'
								htmlType='submit'
								loading={isLoading}
								size='large'
							>
								{editingProduct ? 'Cập nhật' : 'Tạo mới'}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default Products;
