import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Form,
	Input,
	InputNumber,
	Button,
	Card,
	Space,
	message,
	Breadcrumb,
	Row,
	Col,
} from 'antd';
import {
	SaveOutlined,
	ArrowLeftOutlined,
	InboxOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { MainLayout } from '../../layouts';
import { useApi } from '../../services/hooks';
import { ProductService } from '../../services';
import { useAuthStore } from '../../store';
import type { Product } from '../../interfaces';
import { checkAuthentication, handleApiError } from '../../utils';
import './CreateEditProduct.css';

// Temporary interface to handle TypeScript cache issue
interface ProductWithDetailInfo extends Product {
	detail_info?: string;
}

const { TextArea } = Input;

const CreateEditProduct: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditing = !!id;

	const [isLoading, setIsLoading] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string>('');
	const [detailContent, setDetailContent] = useState('');
	const [uploading, setUploading] = useState(false);
	const [form] = Form.useForm();
	const quillRef = useRef<ReactQuill>(null);

	// Auth info
	const { isAuthenticated, token } = useAuthStore();

	// Fetch product data if editing
	const { data: product } = useApi<Product>(
		isEditing ? `/products/${id}` : null,
	);

	// Load product data when editing
	useEffect(() => {
		if (isEditing && product) {
			const productWithDetail = product as ProductWithDetailInfo;
			setDetailContent(productWithDetail.detail_info || '');
			form.setFieldsValue({
				title: product.title,
				description: product.description,
				price: product.price,
				image_url: product.image_url,
			});
			if (product.image_url) {
				setPreviewImage(product.image_url);
			}
		}
	}, [isEditing, product, form]);

	// Custom image handler for ReactQuill
	const imageHandler = () => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = async () => {
			const file = input.files?.[0];
			if (file) {
				try {
					setUploading(true);

					const uploadResult = await ProductService.uploadEditorImage(file);

					if (uploadResult.url && uploadResult.url.length > 0) {
						// Get Quill editor instance
						const quill = quillRef.current?.getEditor();
						if (quill) {
							// Get current selection range
							const range = quill.getSelection();
							const index = range ? range.index : quill.getLength();

							// Insert image at current cursor position
							quill.insertEmbed(index, 'image', uploadResult.url[0].url);

							// Move cursor to after the image
							quill.setSelection(index + 1);
						}

						message.success('Tải ảnh lên thành công!');
					} else {
						message.error('Có lỗi xảy ra khi tải ảnh lên!');
					}
				} catch (error) {
					console.error('Error uploading image:', error);
					message.error('Có lỗi xảy ra khi tải ảnh lên!');
				} finally {
					setUploading(false);
				}
			}
		};
	};

	// Quill modules
	const modules = {
		toolbar: {
			container: [
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				['bold', 'italic', 'underline', 'strike'],
				[{ color: [] }, { background: [] }],
				[{ script: 'sub' }, { script: 'super' }],
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ indent: '-1' }, { indent: '+1' }],
				[{ align: [] }],
				['blockquote', 'code-block'],
				['link', 'image', 'video'],
				['clean'],
			],
			handlers: {
				image: imageHandler,
			},
		},
	};

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'color',
		'background',
		'script',
		'list',
		'bullet',
		'indent',
		'align',
		'blockquote',
		'code-block',
		'link',
		'image',
		'video',
	];

	// Handle create/update product
	const handleSubmitProduct = async (values: {
		title: string;
		description: string;
		price?: number;
		image_url?: string;
	}) => {
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			if (isEditing && product) {
				// Update existing product
				if (uploadedFile) {
					// Update with image
					await ProductService.updateProductWithImage(product.id, {
						title: values.title,
						description: values.description,
						detail_info: detailContent,
						price: values.price,
						image: uploadedFile,
					});
				} else {
					// Update without image
					const productData = {
						title: values.title,
						description: values.description,
						detail_info: detailContent,
						price: values.price,
						image_url: values.image_url || '',
					};
					await ProductService.updateProduct(product.id, productData);
				}
				message.success('Cập nhật sản phẩm thành công!');
			} else {
				// Create new product
				if (uploadedFile) {
					// Create with image upload
					await ProductService.createProductWithImage({
						title: values.title,
						description: values.description,
						detail_info: detailContent,
						price: values.price,
						image: uploadedFile,
					});
				} else {
					// Create with image URL only
					const productData = {
						title: values.title,
						description: values.description,
						detail_info: detailContent,
						price: values.price,
						image_url: values.image_url || '',
					};
					await ProductService.createProduct(productData);
				}
				message.success('Tạo sản phẩm thành công!');
			}

			// Navigate back to products list
			navigate('/admin/products');
		} catch (error: unknown) {
			handleApiError(
				error,
				isEditing ? 'Lỗi khi cập nhật sản phẩm' : 'Lỗi khi tạo sản phẩm',
			);
		} finally {
			setIsLoading(false);
		}
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
		if (isEditing && product?.image_url) {
			setPreviewImage(product.image_url);
		} else {
			setPreviewImage('');
		}
	};

	// Handle back button
	const handleBack = () => {
		navigate('/admin/products');
	};

	if (!isAuthenticated) {
		return (
			<MainLayout
				title={isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
			>
				<div className='loading'>
					<h3>Vui lòng đăng nhập để tiếp tục</h3>
				</div>
			</MainLayout>
		);
	}

	if (isEditing && !product) {
		return (
			<MainLayout title='Chỉnh sửa sản phẩm'>
				<div className='loading'>
					<div>Đang tải...</div>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout title={isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}>
			<div className='create-edit-product-page'>
				<Card>
					{/* Header */}
					<Row
						justify='space-between'
						align='middle'
						style={{ marginBottom: 24 }}
					>
						<Col>
							<Breadcrumb
								items={[
									{
										title: (
											<Button
												type='link'
												onClick={handleBack}
												style={{ padding: 0 }}
											>
												Quản lý sản phẩm
											</Button>
										),
									},
									{
										title: isEditing
											? 'Chỉnh sửa sản phẩm'
											: 'Thêm sản phẩm mới',
									},
								]}
							/>
							<h2 style={{ margin: '8px 0 0 0' }}>
								{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
							</h2>
						</Col>
						<Col>
							<Button
								icon={<ArrowLeftOutlined />}
								onClick={handleBack}
								size='large'
							>
								Quay lại
							</Button>
						</Col>
					</Row>

					{/* Form */}
					<Form
						form={form}
						layout='vertical'
						onFinish={handleSubmitProduct}
						style={{ width: '100%' }}
					>
						<Form.Item
							name='title'
							label='Tên sản phẩm'
							rules={[
								{ required: true, message: 'Vui lòng nhập tên sản phẩm!' },
							]}
						>
							<Input placeholder='Nhập tên sản phẩm' size='large' />
						</Form.Item>

						<Form.Item
							name='description'
							label='Mô tả ngắn'
							rules={[
								{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' },
							]}
						>
							<TextArea
								rows={3}
								placeholder='Nhập mô tả ngắn sản phẩm'
								size='large'
							/>
						</Form.Item>

						{/* Rich Text Editor for detailed description */}
						<Form.Item label='Mô tả chi tiết'>
							<div className={`product-editor ${uploading ? 'uploading' : ''}`}>
								<ReactQuill
									ref={quillRef}
									theme='snow'
									value={detailContent}
									onChange={setDetailContent}
									modules={modules}
									formats={formats}
									placeholder='Nhập mô tả chi tiết sản phẩm...'
								/>
							</div>
						</Form.Item>

						<Form.Item
							name='price'
							label='Giá (VNĐ)'
							rules={[
								{ type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' },
							]}
						>
							<InputNumber
								placeholder='Nhập giá sản phẩm (tùy chọn)'
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

						{/* Action buttons */}
						<Form.Item style={{ marginTop: 40 }}>
							<Space size='large'>
								<Button size='large' onClick={handleBack}>
									Hủy
								</Button>
								<Button
									type='primary'
									htmlType='submit'
									loading={isLoading || uploading}
									size='large'
									disabled={uploading}
									icon={<SaveOutlined />}
								>
									{isLoading
										? isEditing
											? 'Đang cập nhật...'
											: 'Đang tạo...'
										: uploading
										? 'Đang tải ảnh...'
										: isEditing
										? 'Cập nhật sản phẩm'
										: 'Tạo sản phẩm mới'}
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Card>
			</div>
		</MainLayout>
	);
};

export default CreateEditProduct;
