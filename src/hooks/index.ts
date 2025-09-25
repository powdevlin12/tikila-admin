import { useState } from 'react';

// Custom hook for managing loading state
export const useLoading = (initialState: boolean = false) => {
	const [loading, setLoading] = useState(initialState);

	const startLoading = () => setLoading(true);
	const stopLoading = () => setLoading(false);

	return { loading, startLoading, stopLoading, setLoading };
};

// Custom hook for managing modal state
export const useModal = (initialState: boolean = false) => {
	const [isOpen, setIsOpen] = useState(initialState);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);
	const toggleModal = () => setIsOpen(!isOpen);

	return { isOpen, openModal, closeModal, toggleModal };
};

// Custom hook for managing form state
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

	const setValue = (name: keyof T, value: any) => {
		setValues(prev => ({ ...prev, [name]: value }));
		// Clear error when value changes
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	const setError = (name: keyof T, error: string) => {
		setErrors(prev => ({ ...prev, [name]: error }));
	};

	const clearErrors = () => setErrors({});

	const reset = () => {
		setValues(initialValues);
		clearErrors();
	};

	return {
		values,
		errors,
		setValue,
		setError,
		clearErrors,
		reset,
		setValues,
	};
};
