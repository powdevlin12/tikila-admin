import { apiDelete } from './mutations';
import apiClient from './api';
import { triggerDashboardRefresh } from '../hooks/useDashboard';
import type {
	ContactCustomer,
	ContactCustomerListResponse,
	ContactStats,
} from '../interfaces/contact';

export class ContactService {
	// Lấy tất cả contacts
	static async getAllContacts(): Promise<ContactCustomerListResponse> {
		return apiClient.get('/contact-customer');
	}

	// Xóa contact
	static async deleteContact(id: number) {
		const result = await apiDelete<{ message: string }>(
			`/contact-customer/${id}`,
			{
				revalidateKeys: ['/contact-customer'],
			},
		);

		// Trigger dashboard refresh after successful deletion
		triggerDashboardRefresh();

		return result;
	}

	// Tính toán thống kê
	static calculateStats(contacts: ContactCustomer[]): ContactStats {
		const now = new Date();
		const startOfToday = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
		);
		const startOfWeek = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() - now.getDay(),
		);
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		const today = contacts.filter(
			contact => new Date(contact.created_at) >= startOfToday,
		).length;

		const thisWeek = contacts.filter(
			contact => new Date(contact.created_at) >= startOfWeek,
		).length;

		const thisMonth = contacts.filter(
			contact => new Date(contact.created_at) >= startOfMonth,
		).length;

		// Group by service
		const serviceMap = new Map<number, { title: string; count: number }>();
		contacts.forEach(contact => {
			if (contact.service_id) {
				const existing = serviceMap.get(contact.service_id);
				if (existing) {
					existing.count++;
				} else {
					serviceMap.set(contact.service_id, {
						title: contact.service_title || `Service ${contact.service_id}`,
						count: 1,
					});
				}
			}
		});

		const byService = Array.from(serviceMap.entries()).map(
			([service_id, data]) => ({
				service_id,
				service_title: data.title,
				count: data.count,
			}),
		);

		return {
			total: contacts.length,
			thisMonth,
			thisWeek,
			today,
			byService,
		};
	}
}
