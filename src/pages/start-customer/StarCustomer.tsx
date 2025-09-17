import React, { useState, useMemo } from 'react';
import { useApi } from '../../services';
import { StarCustomerService } from '../../services/starCustomerService';
import { handleApiError } from '../../utils/errorHandler';
import type {
	StarCustomer,
	CreateStarCustomerPayload,
	StarCustomerStats,
} from '../../interfaces/starCustomer';
import { Button, Modal } from '../../components/ui';
import './StarCustomer.styles.css';

const StarCustomer: React.FC = () => {
	const [selectedStarCustomer, setSelectedStarCustomer] =
		useState<StarCustomer | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating'>('date');
	const [filterByRating, setFilterByRating] = useState<number | 'all'>('all');

	// Form state for adding new star customer
	const [newStarCustomer, setNewStarCustomer] =
		useState<CreateStarCustomerPayload>({
			star: 5,
			name_customer: '',
			content: '',
		});

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
	const handleAddStarCustomer = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newStarCustomer.name_customer.trim()) {
			alert('Vui lòng nhập tên khách hàng!');
			return;
		}

		setIsAdding(true);
		try {
			const result = await StarCustomerService.addStarCustomer(newStarCustomer);
			console.log('Add star customer result:', result);
			alert('Thêm đánh giá khách hàng thành công!');
			setShowAddModal(false);
			setNewStarCustomer({
				star: 5,
				name_customer: '',
				content: '',
			});
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
		if (
			!window.confirm(
				`Bạn có chắc chắn muốn xóa đánh giá của ${customer.name_customer}?`,
			)
		) {
			return;
		}

		setIsDeleting(true);
		try {
			await StarCustomerService.deleteStarCustomer(customer.id);
			alert('Xóa đánh giá thành công!');
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

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
				★
			</span>
		));
	};

	if (loading) {
		return <div className='loading'>Đang tải dữ liệu...</div>;
	}

	if (error) {
		return (
			<div className='error'>
				<h2>Lỗi tải dữ liệu</h2>
				<p>{error.message}</p>
				<Button onClick={() => mutateStarCustomers()}>Thử lại</Button>
			</div>
		);
	}

	return (
		<div className='star-customers-page'>
			<h1>Quản lý đánh giá khách hàng</h1>

			{/* Statistics Section */}
			<section className='stats-section'>
				<h2>Thống kê</h2>
				<div className='stats-grid'>
					<div className='stat-card'>
						<h3>Tổng đánh giá</h3>
						<div className='stat-number'>{stats.total}</div>
					</div>
					<div className='stat-card'>
						<h3>Điểm trung bình</h3>
						<div className='stat-number'>{stats.averageRating}/5</div>
					</div>
					<div className='stat-card rating-distribution'>
						<h3>Phân bố đánh giá</h3>
						<div className='distribution-grid'>
							{Object.entries(stats.distribution)
								.reverse()
								.map(([star, count]) => (
									<div key={star} className='distribution-item'>
										<span className='distribution-star'>{star}★</span>
										<span className='distribution-count'>{count}</span>
									</div>
								))}
						</div>
					</div>
				</div>
			</section>

			{/* Add Button and Filters Section */}
			<section className='controls-section'>
				<div className='controls-row'>
					<Button onClick={() => setShowAddModal(true)} className='add-button'>
						Thêm đánh giá mới
					</Button>

					<div className='filters-row'>
						<div className='search-box'>
							<input
								type='text'
								placeholder='Tìm kiếm theo tên khách hàng hoặc nội dung...'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className='search-input'
							/>
						</div>

						<div className='filter-group'>
							<label>Sắp xếp:</label>
							<select
								value={sortBy}
								onChange={e =>
									setSortBy(e.target.value as 'date' | 'name' | 'rating')
								}
								className='filter-select'
							>
								<option value='date'>Ngày tạo</option>
								<option value='name'>Tên khách hàng</option>
								<option value='rating'>Điểm đánh giá</option>
							</select>
						</div>

						<div className='filter-group'>
							<label>Lọc theo sao:</label>
							<select
								value={filterByRating}
								onChange={e =>
									setFilterByRating(
										e.target.value === 'all' ? 'all' : Number(e.target.value),
									)
								}
								className='filter-select'
							>
								<option value='all'>Tất cả</option>
								<option value={5}>5 sao</option>
								<option value={4}>4 sao</option>
								<option value={3}>3 sao</option>
								<option value={2}>2 sao</option>
								<option value={1}>1 sao</option>
							</select>
						</div>
					</div>
				</div>
			</section>

			{/* Star Customers Table */}
			<section className='star-customers-section'>
				<div className='section-header'>
					<h2>Danh sách đánh giá ({filteredStarCustomers.length})</h2>
				</div>

				{filteredStarCustomers.length === 0 ? (
					<div className='no-data'>
						{searchTerm || filterByRating !== 'all'
							? 'Không tìm thấy đánh giá nào phù hợp với bộ lọc.'
							: 'Chưa có đánh giá nào từ khách hàng.'}
					</div>
				) : (
					<div className='star-customers-table-container'>
						<table className='star-customers-table'>
							<thead>
								<tr>
									<th>Tên khách hàng</th>
									<th>Đánh giá</th>
									<th>Nội dung</th>
									<th>Ngày tạo</th>
									<th>Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{filteredStarCustomers.map(customer => (
									<tr key={customer.id}>
										<td>
											<div className='customer-name'>
												{customer.name_customer}
											</div>
										</td>
										<td>
											<div className='rating-display'>
												{renderStars(customer.star)}
												<span className='rating-number'>({customer.star})</span>
											</div>
										</td>
										<td>
											<div className='content-preview'>
												{customer.content
													? customer.content.length > 50
														? `${customer.content.substring(0, 50)}...`
														: customer.content
													: 'Không có nội dung'}
											</div>
										</td>
										<td>{formatDate(customer.created_at)}</td>
										<td>
											<div className='action-buttons'>
												<Button onClick={() => handleViewDetail(customer)}>
													Xem chi tiết
												</Button>
												<Button
													variant='danger'
													onClick={() => handleDeleteStarCustomer(customer)}
													disabled={isDeleting}
												>
													{isDeleting ? 'Đang xóa...' : 'Xóa'}
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>

			{/* Add Star Customer Modal */}
			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				title='Thêm đánh giá khách hàng mới'
			>
				<form
					onSubmit={handleAddStarCustomer}
					className='add-star-customer-form'
				>
					<div className='form-group'>
						<label htmlFor='name_customer'>Tên khách hàng *</label>
						<input
							type='text'
							id='name_customer'
							value={newStarCustomer.name_customer}
							onChange={e =>
								setNewStarCustomer(prev => ({
									...prev,
									name_customer: e.target.value,
								}))
							}
							required
							className='form-input'
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='star'>Đánh giá *</label>
						<select
							id='star'
							value={newStarCustomer.star}
							onChange={e =>
								setNewStarCustomer(prev => ({
									...prev,
									star: Number(e.target.value),
								}))
							}
							className='form-select'
						>
							<option value={5}>5 sao - Tuyệt vời</option>
							<option value={4}>4 sao - Tốt</option>
							<option value={3}>3 sao - Trung bình</option>
							<option value={2}>2 sao - Kém</option>
							<option value={1}>1 sao - Rất kém</option>
						</select>
					</div>

					<div className='form-group'>
						<label htmlFor='content'>Nội dung đánh giá</label>
						<textarea
							id='content'
							value={newStarCustomer.content}
							onChange={e =>
								setNewStarCustomer(prev => ({
									...prev,
									content: e.target.value,
								}))
							}
							rows={4}
							className='form-textarea'
							placeholder='Nhập nội dung đánh giá...'
						/>
					</div>

					<div className='form-actions'>
						<Button
							type='button'
							variant='secondary'
							onClick={() => setShowAddModal(false)}
						>
							Hủy
						</Button>
						<Button type='submit' disabled={isAdding}>
							{isAdding ? 'Đang thêm...' : 'Thêm đánh giá'}
						</Button>
					</div>
				</form>
			</Modal>

			{/* Star Customer Detail Modal */}
			<Modal
				isOpen={showDetailModal}
				onClose={() => setShowDetailModal(false)}
				title='Chi tiết đánh giá'
			>
				{selectedStarCustomer && (
					<div className='star-customer-detail'>
						<div className='detail-row'>
							<strong>Tên khách hàng:</strong>
							<span>{selectedStarCustomer.name_customer}</span>
						</div>
						<div className='detail-row'>
							<strong>Đánh giá:</strong>
							<div className='rating-display'>
								{renderStars(selectedStarCustomer.star)}
								<span className='rating-number'>
									({selectedStarCustomer.star}/5)
								</span>
							</div>
						</div>
						<div className='detail-row'>
							<strong>Ngày tạo:</strong>
							<span>{formatDate(selectedStarCustomer.created_at)}</span>
						</div>
						<div className='detail-row'>
							<strong>Nội dung:</strong>
							<div className='content-full'>
								{selectedStarCustomer.content || 'Không có nội dung đánh giá.'}
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default StarCustomer;
