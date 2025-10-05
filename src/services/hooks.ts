import useSWR from 'swr';
import apiClient from './api';

// Interface cho response data
export interface ApiResponse<T = unknown> {
	data: T;
	loading: boolean;
	error: Error | null;
	mutate: () => void;
}

// Fetcher function cho SWR
const fetcher = (url: string) => apiClient.get(url);

// Hook chính để fetch data
export const useApi = <T = unknown>(url: string | null): ApiResponse<T> => {
	const { data, error, mutate } = useSWR(url, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		dedupingInterval: 2000,
	});

	console.log({ data });

	return {
		data: data as T,
		loading: !error && !data,
		error,
		mutate,
	};
};

// Hook để fetch data với pagination
export const useApiWithPagination = <T = unknown>(
	url: string | null,
	page: number = 1,
	limit: number = 10,
): ApiResponse<T> => {
	const paginatedUrl = url ? `${url}?page=${page}&limit=${limit}` : null;
	return useApi<T>(paginatedUrl);
};

// Hook để fetch data với query parameters
export const useApiWithQuery = <T = unknown>(
	url: string | null,
	query: Record<string, string | number | boolean> = {},
): ApiResponse<T> => {
	const queryString = new URLSearchParams(
		Object.entries(query)
			.filter(([, value]) => value !== undefined && value !== null)
			.map(([key, value]) => [key, String(value)]),
	).toString();

	const urlWithQuery = url && queryString ? `${url}?${queryString}` : url;
	return useApi<T>(urlWithQuery);
};

// Hook để fetch data conditional (chỉ fetch khi condition = true)
export const useApiConditional = <T = unknown>(
	url: string | null,
	condition: boolean,
): ApiResponse<T> => {
	return useApi<T>(condition ? url : null);
};
