import type { ContactCustomer } from '../interfaces/contact';

/**
 * Utility functions to handle backward compatibility between old snake_case
 * and new camelCase field names from TypeORM entities
 */

export const getContactName = (contact: ContactCustomer): string => {
	return contact.fullName || contact.full_name || '';
};

export const getContactPhone = (contact: ContactCustomer): string => {
	return contact.phoneCustomer || contact.phone_customer || '';
};

export const getContactServiceId = (
	contact: ContactCustomer,
): number | null => {
	return contact.serviceId ?? contact.service_id ?? null;
};

export const getContactCreatedAt = (contact: ContactCustomer): string => {
	return contact.createdAt || contact.created_at || '';
};

export const getContactServiceTitle = (contact: ContactCustomer): string => {
	return contact.service?.title || contact.service_title || '';
};

export const getContactMessage = (contact: ContactCustomer): string => {
	return contact.message || '';
};
