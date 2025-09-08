import React, { useState } from 'react';
import { useApi } from '../../services';
import { FooterLinkService } from '../../services/footerLinkService';
import { useAuthStore } from '../../store/authStore';
import { handleApiError, checkAuthentication } from '../../utils/errorHandler';
import type { FooterLink, FooterLinkCreateRequest } from '../../interfaces';
import { Button, Input, Modal } from '../../components/ui';
import { MainLayout } from '../../layouts';
import './Footer.css';

const Footer = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
	const [formData, setFormData] = useState<FooterLinkCreateRequest>({
		title: '',
		url: '',
		column_position: 1,
		title_column: '',
	});

	// Auth info
	const { isAuthenticated, token } = useAuthStore();

	// Fetch data
	const { data: footerLinks, mutate: mutateFooterLinks } = useApi<FooterLink[]>(
		'/company/footer-links',
	);

	// Group links by column
	const groupedLinks =
		footerLinks?.reduce((acc, link) => {
			const column = link.column_position;
			if (!acc[column]) {
				acc[column] = [];
			}
			acc[column].push(link);
			return acc;
		}, {} as Record<number, FooterLink[]>) || {};

	// Handle create/update
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title || !formData.url) {
			alert('Vui lòng điền đầy đủ thông tin');
			return;
		}

		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			if (editingLink) {
				await FooterLinkService.updateFooterLink(
					editingLink.id!.toString(),
					formData,
				);
				alert('Cập nhật footer link thành công!');
			} else {
				await FooterLinkService.createFooterLink(formData);
				alert('Tạo footer link thành công!');
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
		if (!window.confirm(`Bạn có chắc chắn muốn xóa link "${link.title}"?`)) {
			return;
		}

		if (!checkAuthentication(isAuthenticated, token)) {
			return;
		}

		setIsLoading(true);
		try {
			await FooterLinkService.deleteFooterLink(link.id!.toString());
			alert('Xóa footer link thành công!');
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
		setFormData({
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
		setFormData({
			title: '',
			url: '',
			column_position: 1,
			title_column: '',
		});
		setShowCreateModal(true);
	};

	// Handle close modal
	const handleCloseModal = () => {
		setShowCreateModal(false);
		setEditingLink(null);
		setFormData({
			title: '',
			url: '',
			column_position: 1,
			title_column: '',
		});
	};

	// Handle input change
	const handleInputChange = (
		field: keyof FooterLinkCreateRequest,
		value: string | number,
	) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<MainLayout>
			<div className='footer-admin-page'>
				<div className='page-header'>
					<h1>Quản lý Footer Links</h1>
					<Button onClick={handleCreateNew}>Thêm Link Mới</Button>
				</div>

				<div className='footer-preview'>
					<h2>Preview Footer</h2>
					<div className='footer-columns'>
						{[1, 2, 3, 4].map(columnNumber => (
							<div key={columnNumber} className='footer-column'>
								<h3>Cột {columnNumber}</h3>
								{groupedLinks[columnNumber]?.length > 0 ? (
									<>
										{groupedLinks[columnNumber][0]?.title_column && (
											<h4 className='column-title'>
												{groupedLinks[columnNumber][0].title_column}
											</h4>
										)}
										<ul className='footer-links-list'>
											{groupedLinks[columnNumber].map(link => (
												<li key={link.id} className='footer-link-item'>
													<div className='link-info'>
														<a
															href={link.url}
															target='_blank'
															rel='noopener noreferrer'
														>
															{link.title}
														</a>
													</div>
													<div className='link-actions'>
														<Button
															variant='secondary'
															onClick={() => handleEdit(link)}
														>
															Sửa
														</Button>
														<Button
															variant='danger'
															onClick={() => handleDelete(link)}
															disabled={isLoading}
														>
															Xóa
														</Button>
													</div>
												</li>
											))}
										</ul>
									</>
								) : (
									<p className='empty-column'>Chưa có link nào</p>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Modal for Create/Edit */}
				<Modal
					isOpen={showCreateModal}
					onClose={handleCloseModal}
					title={editingLink ? 'Chỉnh sửa Footer Link' : 'Thêm Footer Link Mới'}
				>
					<form onSubmit={handleSubmit} className='footer-link-form'>
						<div className='form-group'>
							<label>Tiêu đề:</label>
							<Input
								value={formData.title}
								onChange={e => handleInputChange('title', e.target.value)}
								placeholder='Nhập tiêu đề link'
								required
							/>
						</div>

						<div className='form-group'>
							<label>URL:</label>
							<Input
								value={formData.url}
								onChange={e => handleInputChange('url', e.target.value)}
								placeholder='Nhập URL (VD: https://example.com)'
								required
							/>
						</div>

						<div className='form-group'>
							<label>Cột hiển thị:</label>
							<select
								value={formData.column_position}
								onChange={e =>
									handleInputChange('column_position', parseInt(e.target.value))
								}
								className='form-select'
							>
								<option value={1}>Cột 1</option>
								<option value={2}>Cột 2</option>
								<option value={3}>Cột 3</option>
								<option value={4}>Cột 4</option>
							</select>
						</div>

						<div className='form-group'>
							<label>Tiêu đề cột (tùy chọn):</label>
							<Input
								value={formData.title_column}
								onChange={e =>
									handleInputChange('title_column', e.target.value)
								}
								placeholder='Nhập tiêu đề cột (VD: Dịch vụ, Chính sách...)'
							/>
						</div>

						<div className='form-actions'>
							<Button
								type='button'
								variant='secondary'
								onClick={handleCloseModal}
							>
								Hủy
							</Button>
							<Button type='submit' disabled={isLoading}>
								{isLoading
									? 'Đang xử lý...'
									: editingLink
									? 'Cập nhật'
									: 'Tạo mới'}
							</Button>
						</div>
					</form>
				</Modal>
			</div>
		</MainLayout>
	);
};

export default Footer;
