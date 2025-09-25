import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Table,
	Button,
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
} from '@ant-design/icons';
import './Products.css';
import { MainLayout } from '../../layouts';
import { useApi } from '../../services/hooks';
import { ProductService } from '../../services';
import { useAuthStore } from '../../store';
import type { Product } from '../../interfaces';
import { checkAuthentication, handleApiError } from '../../utils';

const Products: React.FC = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	// Auth info
	const { isAuthenticated, token } = useAuthStore();

	// Fetch data
	const { data: productsResponse, mutate: mutateProducts } = useApi<{
		success: boolean;
		message: string;
		data: Product[];
	}>('/products');

	// Extract products array from API response
	const products = productsResponse?.data || [];

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
		navigate(`/admin/products/edit/${product.id}`);
	};

	// Open create modal
	const handleCreateProduct = () => {
		navigate('/admin/products/create');
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

	if (!productsResponse) {
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
					dataSource={Array.isArray(products) ? products : []}
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
		</div>
	);
};

export default Products;
