import { mutate } from 'swr';
import apiClient from './api';

// Interface cho mutation options
interface MutationOptions {
	onSuccess?: (data: unknown) => void;
	onError?: (error: Error) => void;
	revalidateKeys?: string[];
}

// POST request
export const apiPost = async <T = unknown>(
	url: string,
	data: unknown,
	options: MutationOptions = {},
): Promise<T> => {
	try {
		const response = await apiClient.post(url, data);

		if (options.onSuccess) {
			options.onSuccess(response);
		}

		// Revalidate các keys liên quan
		if (options.revalidateKeys) {
			options.revalidateKeys.forEach(key => mutate(key));
		}

		return response as T;
	} catch (error) {
		if (options.onError && error instanceof Error) {
			options.onError(error);
		}
		throw error;
	}
};

// PUT request
export const apiPut = async <T = unknown>(
	url: string,
	data: unknown,
	options: MutationOptions = {},
): Promise<T> => {
	try {
		const response = await apiClient.put(url, data);

		if (options.onSuccess) {
			options.onSuccess(response);
		}

		if (options.revalidateKeys) {
			options.revalidateKeys.forEach(key => mutate(key));
		}

		return response as T;
	} catch (error) {
		if (options.onError && error instanceof Error) {
			options.onError(error);
		}
		throw error;
	}
};

// DELETE request
export const apiDelete = async <T = unknown>(
	url: string,
	options: MutationOptions = {},
): Promise<T> => {
	try {
		const response = await apiClient.delete(url);

		if (options.onSuccess) {
			options.onSuccess(response);
		}

		if (options.revalidateKeys) {
			options.revalidateKeys.forEach(key => mutate(key));
		}

		return response as T;
	} catch (error) {
		if (options.onError && error instanceof Error) {
			options.onError(error);
		}
		throw error;
	}
};

// PATCH request
export const apiPatch = async <T = unknown>(
	url: string,
	data: unknown,
	options: MutationOptions = {},
): Promise<T> => {
	try {
		const response = await apiClient.patch(url, data);

		if (options.onSuccess) {
			options.onSuccess(response);
		}

		if (options.revalidateKeys) {
			options.revalidateKeys.forEach(key => mutate(key));
		}

		return response as T;
	} catch (error) {
		if (options.onError && error instanceof Error) {
			options.onError(error);
		}
		throw error;
	}
};
