import React, { useState, useRef } from 'react';
import { useApi } from '../../services';
import { CompanyService } from '../../services/companyService';
import { useAuthStore } from '../../store/authStore';
import { handleApiError, checkAuthentication } from '../../utils/errorHandler';
import type {
	CompanyInfo,
	CompanyContact,
	Service,
	CompanyUpdateRequest,
} from '../../interfaces/company';
import { Button, Input, Modal } from '../../components/ui';
import './Company.styles.css';

export const Company = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showServiceModal, setShowServiceModal] = useState(false);
	const [newService, setNewService] = useState({
		title: '',
		description: '',
		image_url: '',
	});
	const [editMode, setEditMode] = useState(false);
	const [companyData, setCompanyData] = useState<CompanyUpdateRequest>({});

	// Auth info
	const { isAuthenticated, token, user } = useAuthStore();

	// File refs
	const logoFileRef = useRef<HTMLInputElement>(null);
	const introImageRef = useRef<HTMLInputElement>(null);
	const bannerImageRef = useRef<HTMLInputElement>(null);

	// Fetch data
	const { data: companyInfo, mutate: mutateCompanyInfo } =
		useApi<CompanyInfo>('/company/info');
	const { data: contactInfo } = useApi<CompanyContact>('/company/contact');
	const { data: services, mutate: mutateServices } =
		useApi<Service[]>('/company/services');

	// Handle form submission
	const handleUpdateCompanyInfo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!companyData || Object.keys(companyData).length === 0) {
			alert('Không có dữ liệu để cập nhật');
			return;
		}

		// Check authentication
		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await CompanyService.updateCompanyInfo(companyData);
			alert('Cập nhật thông tin công ty thành công!');
			mutateCompanyInfo();
			setEditMode(false);
			setCompanyData({});
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi cập nhật thông tin công ty');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle file uploads
	const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await CompanyService.updateCompanyLogo(file);
			alert('Cập nhật logo thành công!');
			mutateCompanyInfo();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi upload logo');
		} finally {
			setIsLoading(false);
		}
	};

	const handleIntroImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await CompanyService.updateCompanyImgIntro(file);
			alert('Cập nhật ảnh giới thiệu thành công!');
			mutateCompanyInfo();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi upload ảnh giới thiệu');
		} finally {
			setIsLoading(false);
		}
	};

	const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await CompanyService.updateCompanyBanner(file);
			alert('Cập nhật banner thành công!');
			mutateCompanyInfo();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi upload banner');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle create service
	const handleCreateService = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newService.title || !newService.description) {
			alert('Vui lòng điền đầy đủ thông tin dịch vụ');
			return;
		}

		setIsLoading(true);
		try {
			await CompanyService.createService(newService);
			alert('Tạo dịch vụ thành công!');
			mutateServices();
			setShowServiceModal(false);
			setNewService({ title: '', description: '', image_url: '' });
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi tạo dịch vụ');
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (
		field: keyof CompanyUpdateRequest,
		value: string | number,
	) => {
		setCompanyData(prev => ({
			...prev,
			[field]: value,
		}));
	};

	if (!companyInfo) {
		return (
			<div className='loading'>
				<div>Đang tải...</div>
				<div>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
				<div>Token: {token ? 'Present' : 'Missing'}</div>
				<div>User: {user?.email || 'No user'}</div>
				
				{!isAuthenticated && (
					<div style={{ marginTop: '20px' }}>
						<h3>Vui lòng đăng nhập để tiếp tục:</h3>
						{/* <LoginDemo /> */}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className='company-page'>
			<h1>Quản lý thông tin công ty</h1>

			{/* Company Info Section */}
			<section className='company-section'>
				<div className='section-header'>
					<h2>Thông tin công ty</h2>
					<Button
						onClick={() => setEditMode(!editMode)}
						variant={editMode ? 'secondary' : 'primary'}
					>
						{editMode ? 'Hủy' : 'Chỉnh sửa'}
					</Button>
				</div>

				<form onSubmit={handleUpdateCompanyInfo} className='company-form'>
					<div className='form-row'>
						<div className='form-group'>
							<label>Tên công ty:</label>
							{editMode ? (
								<Input
									value={companyData.name ?? companyInfo.name ?? ''}
									onChange={e => handleInputChange('name', e.target.value)}
									placeholder='Nhập tên công ty'
								/>
							) : (
								<p className='form-value'>
									{companyInfo.name || 'Chưa có thông tin'}
								</p>
							)}
						</div>

						<div className='form-group'>
							<label>Email:</label>
							{editMode ? (
								<Input
									type='email'
									value={companyData.email ?? companyInfo.email ?? ''}
									onChange={e => handleInputChange('email', e.target.value)}
									placeholder='Nhập email công ty'
								/>
							) : (
								<p className='form-value'>
									{companyInfo.email || 'Chưa có thông tin'}
								</p>
							)}
						</div>
					</div>

					<div className='form-row'>
						<div className='form-group'>
							<label>Địa chỉ:</label>
							{editMode ? (
								<Input
									value={companyData.address ?? companyInfo.address ?? ''}
									onChange={e => handleInputChange('address', e.target.value)}
									placeholder='Nhập địa chỉ công ty'
								/>
							) : (
								<p className='form-value'>
									{companyInfo.address || 'Chưa có thông tin'}
								</p>
							)}
						</div>

						<div className='form-group'>
							<label>Mã số thuế:</label>
							{editMode ? (
								<Input
									value={companyData.tax_code ?? companyInfo.tax_code ?? ''}
									onChange={e => handleInputChange('tax_code', e.target.value)}
									placeholder='Nhập mã số thuế'
								/>
							) : (
								<p className='form-value'>
									{companyInfo.tax_code || 'Chưa có thông tin'}
								</p>
							)}
						</div>
					</div>

					<div className='form-group'>
						<label>Nội dung chào mừng:</label>
						{editMode ? (
							<textarea
								className='form-textarea'
								value={
									companyData.welcome_content ??
									companyInfo.welcome_content ??
									''
								}
								onChange={e =>
									handleInputChange('welcome_content', e.target.value)
								}
								placeholder='Nhập nội dung chào mừng'
								rows={3}
							/>
						) : (
							<p className='form-value'>
								{companyInfo.welcome_content || 'Chưa có thông tin'}
							</p>
						)}
					</div>

					<div className='form-group'>
						<label>Nội dung giới thiệu:</label>
						{editMode ? (
							<textarea
								className='form-textarea'
								value={companyData.intro_text ?? companyInfo.intro_text ?? ''}
								onChange={e => handleInputChange('intro_text', e.target.value)}
								placeholder='Nhập nội dung giới thiệu'
								rows={4}
							/>
						) : (
							<p className='form-value'>
								{companyInfo.intro_text || 'Chưa có thông tin'}
							</p>
						)}
					</div>

					{/* Statistics */}
					<div className='form-row'>
						<div className='form-group'>
							<label>Số lượng khách hàng:</label>
							{editMode ? (
								<Input
									type='number'
									value={String(
										companyData.COUNT_CUSTOMER ??
											companyInfo.COUNT_CUSTOMER ??
											0,
									)}
									onChange={e =>
										handleInputChange(
											'COUNT_CUSTOMER',
											parseInt(e.target.value) || 0,
										)
									}
									placeholder='Nhập số lượng khách hàng'
								/>
							) : (
								<p className='form-value'>{companyInfo.COUNT_CUSTOMER || 0}</p>
							)}
						</div>

						<div className='form-group'>
							<label>% Khách hàng hài lòng:</label>
							{editMode ? (
								<Input
									type='number'
									value={String(
										companyData.COUNT_CUSTOMER_SATISFY ??
											companyInfo.COUNT_CUSTOMER_SATISFY ??
											0,
									)}
									onChange={e =>
										handleInputChange(
											'COUNT_CUSTOMER_SATISFY',
											parseInt(e.target.value) || 0,
										)
									}
									placeholder='Nhập % khách hàng hài lòng'
								/>
							) : (
								<p className='form-value'>
									{companyInfo.COUNT_CUSTOMER_SATISFY || 0}%
								</p>
							)}
						</div>

						<div className='form-group'>
							<label>Chất lượng (%):</label>
							{editMode ? (
								<Input
									type='number'
									value={String(
										companyData.COUNT_QUANLITY ??
											companyInfo.COUNT_QUANLITY ??
											0,
									)}
									onChange={e =>
										handleInputChange(
											'COUNT_QUANLITY',
											parseInt(e.target.value) || 0,
										)
									}
									placeholder='Nhập % chất lượng'
								/>
							) : (
								<p className='form-value'>{companyInfo.COUNT_QUANLITY || 0}%</p>
							)}
						</div>
					</div>

					{editMode && (
						<div className='form-actions'>
							<Button type='submit' disabled={isLoading}>
								{isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
							</Button>
						</div>
					)}
				</form>
			</section>

			{/* Image Upload Section */}
			<section className='company-section'>
				<h2>Quản lý hình ảnh</h2>
				<div className='image-grid'>
					<div className='image-item'>
						<h3>Logo công ty</h3>
						{companyInfo.logo_url && (
							<img
								src={companyInfo.logo_url}
								alt='Logo'
								className='preview-image'
							/>
						)}
						<input
							type='file'
							accept='image/*'
							ref={logoFileRef}
							onChange={handleLogoUpload}
							style={{ display: 'none' }}
						/>
						<Button
							onClick={() => logoFileRef.current?.click()}
							disabled={isLoading}
						>
							{isLoading ? 'Đang upload...' : 'Cập nhật Logo'}
						</Button>
					</div>

					<div className='image-item'>
						<h3>Ảnh giới thiệu</h3>
						{companyInfo.img_intro && (
							<img
								src={companyInfo.img_intro}
								alt='Intro'
								className='preview-image'
							/>
						)}
						<input
							type='file'
							accept='image/*'
							ref={introImageRef}
							onChange={handleIntroImageUpload}
							style={{ display: 'none' }}
						/>
						<Button
							onClick={() => introImageRef.current?.click()}
							disabled={isLoading}
						>
							{isLoading ? 'Đang upload...' : 'Cập nhật ảnh giới thiệu'}
						</Button>
					</div>

					<div className='image-item'>
						<h3>Banner</h3>
						{companyInfo.BANNER && (
							<img
								src={companyInfo.BANNER}
								alt='Banner'
								className='preview-image'
							/>
						)}
						<input
							type='file'
							accept='image/*'
							ref={bannerImageRef}
							onChange={handleBannerUpload}
							style={{ display: 'none' }}
						/>
						<Button
							onClick={() => bannerImageRef.current?.click()}
							disabled={isLoading}
						>
							{isLoading ? 'Đang upload...' : 'Cập nhật Banner'}
						</Button>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className='company-section'>
				<div className='section-header'>
					<h2>Dịch vụ</h2>
					<Button onClick={() => setShowServiceModal(true)}>
						Thêm dịch vụ mới
					</Button>
				</div>

				<div className='services-grid'>
					{services?.map(service => (
						<div key={service.id} className='service-card'>
							<h4>{service.title}</h4>
							<p>{service.description}</p>
							{service.image_url && (
								<img
									src={service.image_url}
									alt={service.title}
									className='service-image'
								/>
							)}
						</div>
					))}
				</div>
			</section>

			{/* Contact Info Section */}
			{contactInfo && (
				<section className='company-section'>
					<h2>Thông tin liên hệ</h2>
					<div className='contact-info'>
						<p>
							<strong>Điện thoại:</strong>{' '}
							{contactInfo.phone || 'Chưa có thông tin'}
						</p>
						<p>
							<strong>Email:</strong> {contactInfo.email || 'Chưa có thông tin'}
						</p>
						<p>
							<strong>Địa chỉ:</strong>{' '}
							{contactInfo.address || 'Chưa có thông tin'}
						</p>
						<p>
							<strong>Facebook:</strong>{' '}
							{contactInfo.facebook_link || 'Chưa có thông tin'}
						</p>
						<p>
							<strong>Zalo:</strong>{' '}
							{contactInfo.zalo_link || 'Chưa có thông tin'}
						</p>
						<p>
							<strong>TikTok:</strong>{' '}
							{contactInfo.tiktok_link || 'Chưa có thông tin'}
						</p>
						<p>
							<strong>Website:</strong>{' '}
							{contactInfo.website || 'Chưa có thông tin'}
						</p>
					</div>
				</section>
			)}

			{/* Service Modal */}
			<Modal
				isOpen={showServiceModal}
				onClose={() => setShowServiceModal(false)}
				title='Thêm dịch vụ mới'
			>
				<form onSubmit={handleCreateService} className='service-form'>
					<div className='form-group'>
						<label>Tên dịch vụ:</label>
						<Input
							value={newService.title}
							onChange={e =>
								setNewService({ ...newService, title: e.target.value })
							}
							placeholder='Nhập tên dịch vụ'
							required
						/>
					</div>

					<div className='form-group'>
						<label>Mô tả:</label>
						<textarea
							className='form-textarea'
							value={newService.description}
							onChange={e =>
								setNewService({ ...newService, description: e.target.value })
							}
							placeholder='Nhập mô tả dịch vụ'
							rows={4}
							required
						/>
					</div>

					<div className='form-group'>
						<label>URL hình ảnh:</label>
						<Input
							value={newService.image_url}
							onChange={e =>
								setNewService({ ...newService, image_url: e.target.value })
							}
							placeholder='Nhập URL hình ảnh'
						/>
					</div>

					<div className='form-actions'>
						<Button
							type='button'
							variant='secondary'
							onClick={() => setShowServiceModal(false)}
						>
							Hủy
						</Button>
						<Button type='submit' disabled={isLoading}>
							{isLoading ? 'Đang tạo...' : 'Tạo dịch vụ'}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
};
