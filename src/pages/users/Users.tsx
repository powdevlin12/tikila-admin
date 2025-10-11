import React, { useState, useMemo } from 'react';
import { useApi } from '../../services';
import { ContactService } from '../../services/contactService';
import { handleApiError } from '../../utils/errorHandler';
import {
	getContactName,
	getContactPhone,
	getContactServiceId,
	getContactCreatedAt,
	getContactServiceTitle,
	getContactMessage,
} from '../../utils/contactUtils';
import type { ContactCustomer, ContactStats } from '../../interfaces/contact';
import { Button, Modal } from '../../components/ui';
import './Users.styles.css';

const Users: React.FC = () => {
	const [selectedContact, setSelectedContact] =
		useState<ContactCustomer | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
	const [filterByService, setFilterByService] = useState<number | 'all'>('all');

	// Fetch contacts data
	const {
		data: contactsResponse,
		mutate: mutateContacts,
		error,
		loading,
	} = useApi<{
		message: string;
		result: ContactCustomer[];
	}>('/contact-customer');

	const contacts = useMemo(() => {
		return contactsResponse?.result || [];
	}, [contactsResponse?.result]);

	// Calculate statistics
	const stats: ContactStats = useMemo(() => {
		return ContactService.calculateStats(contacts);
	}, [contacts]);

	// Filter and sort contacts
	const filteredContacts = useMemo(() => {
		let filtered = contacts;

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(
				contact =>
					getContactName(contact)
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					getContactPhone(contact).includes(searchTerm) ||
					getContactMessage(contact)
						.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			);
		}

		// Service filter
		if (filterByService !== 'all') {
			filtered = filtered.filter(
				contact => getContactServiceId(contact) === filterByService,
			);
		}

		// Sort
		filtered.sort((a, b) => {
			if (sortBy === 'date') {
				return (
					new Date(getContactCreatedAt(b)).getTime() -
					new Date(getContactCreatedAt(a)).getTime()
				);
			} else {
				return getContactName(a).localeCompare(getContactName(b));
			}
		});

		return filtered;
	}, [contacts, searchTerm, sortBy, filterByService]);

	// Get unique services for filter
	const services = useMemo(() => {
		const serviceMap = new Map();
		contacts.forEach(contact => {
			const serviceId = getContactServiceId(contact);
			const serviceTitle = getContactServiceTitle(contact);
			if (serviceId && serviceTitle) {
				serviceMap.set(serviceId, serviceTitle);
			}
		});
		return Array.from(serviceMap.entries()).map(([id, title]) => ({
			id,
			title,
		}));
	}, [contacts]);

	// Handle delete contact
	const handleDeleteContact = async (contact: ContactCustomer) => {
		if (
			!window.confirm(
				`Bạn có chắc chắn muốn xóa liên hệ của ${getContactName(contact)}?`,
			)
		) {
			return;
		}

		setIsDeleting(true);
		try {
			await ContactService.deleteContact(contact.id);
			alert('Xóa liên hệ thành công!');
			mutateContacts();
		} catch (error: unknown) {
			handleApiError(error, 'Lỗi khi xóa liên hệ');
		} finally {
			setIsDeleting(false);
		}
	};

	// Handle view contact detail
	const handleViewDetail = (contact: ContactCustomer) => {
		setSelectedContact(contact);
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

	if (loading) {
		return <div className='loading'>Đang tải dữ liệu...</div>;
	}

	if (error) {
		return (
			<div className='error'>
				<h2>Lỗi tải dữ liệu</h2>
				<p>{error.message}</p>
				<Button onClick={() => mutateContacts()}>Thử lại</Button>
			</div>
		);
	}

	return (
		<div className='contacts-page'>
			<h1>Quản lý liên hệ khách hàng</h1>

			{/* Statistics Section */}
			<section className='stats-section'>
				<h2>Thống kê</h2>
				<div className='stats-grid'>
					<div className='stat-card'>
						<h3>Tổng liên hệ</h3>
						<div className='stat-number'>{stats.total}</div>
					</div>
					<div className='stat-card'>
						<h3>Hôm nay</h3>
						<div className='stat-number'>{stats.today}</div>
					</div>
					<div className='stat-card'>
						<h3>Tuần này</h3>
						<div className='stat-number'>{stats.thisWeek}</div>
					</div>
					<div className='stat-card'>
						<h3>Tháng này</h3>
						<div className='stat-number'>{stats.thisMonth}</div>
					</div>
				</div>

				{/* Service Statistics */}
				{stats.byService.length > 0 && (
					<div className='service-stats'>
						<h3>Thống kê theo dịch vụ</h3>
						<div className='service-stats-grid'>
							{stats.byService.map(service => (
								<div key={service.service_id} className='service-stat-item'>
									<span className='service-name'>{service.service_title}</span>
									<span className='service-count'>{service.count}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</section>

			{/* Filters and Search */}
			<section className='filters-section'>
				<div className='filters-row'>
					<div className='search-box'>
						<input
							type='text'
							placeholder='Tìm kiếm theo tên, số điện thoại hoặc nội dung...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='search-input'
						/>
					</div>

					<div className='filter-group'>
						<label>Sắp xếp:</label>
						<select
							value={sortBy}
							onChange={e => setSortBy(e.target.value as 'date' | 'name')}
							className='filter-select'
						>
							<option value='date'>Ngày tạo</option>
							<option value='name'>Tên khách hàng</option>
						</select>
					</div>

					<div className='filter-group'>
						<label>Dịch vụ:</label>
						<select
							value={filterByService}
							onChange={e =>
								setFilterByService(
									e.target.value === 'all' ? 'all' : Number(e.target.value),
								)
							}
							className='filter-select'
						>
							<option value='all'>Tất cả</option>
							{services.map(service => (
								<option key={service.id} value={service.id}>
									{service.title}
								</option>
							))}
						</select>
					</div>
				</div>
			</section>

			{/* Contacts Table */}
			<section className='contacts-section'>
				<div className='section-header'>
					<h2>Danh sách liên hệ ({filteredContacts.length})</h2>
				</div>

				{filteredContacts.length === 0 ? (
					<div className='no-data'>
						{searchTerm || filterByService !== 'all'
							? 'Không tìm thấy liên hệ nào phù hợp với bộ lọc.'
							: 'Chưa có liên hệ nào từ khách hàng.'}
					</div>
				) : (
					<div className='contacts-table-container'>
						<table className='contacts-table'>
							<thead>
								<tr>
									<th>Tên khách hàng</th>
									<th>Số điện thoại</th>
									<th>Dịch vụ</th>
									<th>Ngày gửi</th>
									<th>Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{filteredContacts.map(contact => (
									<tr key={contact.id}>
										<td>
											<div className='contact-name'>
												{getContactName(contact)}
											</div>
										</td>
										<td>
											<a
												href={`tel:${getContactPhone(contact)}`}
												className='phone-link'
											>
												{getContactPhone(contact)}
											</a>
										</td>
										<td>{getContactServiceTitle(contact) || 'Tư vấn chung'}</td>
										<td>{formatDate(getContactCreatedAt(contact))}</td>
										<td>
											<div className='action-buttons'>
												<Button onClick={() => handleViewDetail(contact)}>
													Xem chi tiết
												</Button>
												<Button
													variant='danger'
													onClick={() => handleDeleteContact(contact)}
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

			{/* Contact Detail Modal */}
			<Modal
				isOpen={showDetailModal}
				onClose={() => setShowDetailModal(false)}
				title='Chi tiết liên hệ'
			>
				{selectedContact && (
					<div className='contact-detail'>
						<div className='detail-row'>
							<strong>Tên khách hàng:</strong>
							<span>{getContactName(selectedContact)}</span>
						</div>
						<div className='detail-row'>
							<strong>Số điện thoại:</strong>
							<span>
								<a href={`tel:${getContactPhone(selectedContact)}`}>
									{getContactPhone(selectedContact)}
								</a>
							</span>
						</div>
						<div className='detail-row'>
							<strong>Dịch vụ quan tâm:</strong>
							<span>
								{getContactServiceTitle(selectedContact) || 'Tư vấn chung'}
							</span>
						</div>
						<div className='detail-row'>
							<strong>Ngày gửi:</strong>
							<span>{formatDate(getContactCreatedAt(selectedContact))}</span>
						</div>
						<div className='detail-row'>
							<strong>Nội dung:</strong>
							<div className='message-content'>
								{getContactMessage(selectedContact)}
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Users;
