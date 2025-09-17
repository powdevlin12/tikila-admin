import apiClient from './api';
import type {
	StarCustomer,
	CreateStarCustomerPayload,
	StarCustomerStats,
} from '../interfaces/starCustomer';

export class StarCustomerService {
	static async getStarCustomers(): Promise<{
		success: boolean;
		message: string;
		data: StarCustomer[];
	}> {
		return apiClient.get('/star-customers');
	}

	static async getStarCustomerById(id: number): Promise<{
		success: boolean;
		message: string;
		data: StarCustomer;
	}> {
		return apiClient.get(`/star-customers/${id}`);
	}

	static async addStarCustomer(payload: CreateStarCustomerPayload): Promise<{
		success: boolean;
		message: string;
		data: StarCustomer;
	}> {
		return apiClient.post('/star-customers/add', payload);
	}

	static async deleteStarCustomer(id: number): Promise<{
		success: boolean;
		message: string;
	}> {
		return apiClient.delete(`/star-customers/${id}`);
	}

	static async getStarCustomerStats(): Promise<{
		success: boolean;
		message: string;
		data: StarCustomerStats;
	}> {
		return apiClient.get('/star-customers/stats/summary');
	}

	// Helper function to calculate statistics from star customers data
	static calculateStats(starCustomers: StarCustomer[]): StarCustomerStats {
		const total = starCustomers.length;

		if (total === 0) {
			return {
				total: 0,
				averageRating: 0,
				distribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
			};
		}

		// Calculate average rating
		const totalStars = starCustomers.reduce(
			(sum, customer) => sum + customer.star,
			0,
		);
		const averageRating = Number((totalStars / total).toFixed(1));

		// Calculate distribution
		const distribution = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
		starCustomers.forEach(customer => {
			const star = customer.star.toString() as keyof typeof distribution;
			distribution[star]++;
		});

		return {
			total,
			averageRating,
			distribution,
		};
	}
}
