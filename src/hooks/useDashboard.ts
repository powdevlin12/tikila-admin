import { useEffect, useCallback } from 'react';
import { dashboardService } from '../services';

// Hook để tự động refresh dashboard khi có thay đổi dữ liệu
export const useDashboardAutoRefresh = (onRefresh?: () => void) => {
	const refreshDashboard = useCallback(async () => {
		try {
			await dashboardService.refreshDashboardStats();
			if (onRefresh) {
				onRefresh();
			}
		} catch (error) {
			console.error('Auto refresh dashboard failed:', error);
		}
	}, [onRefresh]);

	return { refreshDashboard };
};

// Helper function để trigger dashboard refresh từ các services khác
export const triggerDashboardRefresh = () => {
	// Dispatch custom event để các dashboard component có thể listen
	window.dispatchEvent(new CustomEvent('dashboardRefresh'));
};

// Hook để listen dashboard refresh events
export const useDashboardRefreshListener = (callback: () => void) => {
	useEffect(() => {
		const handleRefresh = () => {
			callback();
		};

		window.addEventListener('dashboardRefresh', handleRefresh);

		return () => {
			window.removeEventListener('dashboardRefresh', handleRefresh);
		};
	}, [callback]);
};
