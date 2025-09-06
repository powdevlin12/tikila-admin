import React from 'react';
import { MainLayout } from '../../layouts';

const Dashboard: React.FC = () => {
	return (
		<MainLayout title='Dashboard'>
			<div className='dashboard'>
				<div className='dashboard-stats'>
					<div className='stat-card'>
						<h3>Total Users</h3>
						<p className='stat-number'>1,234</p>
					</div>
					<div className='stat-card'>
						<h3>Total Products</h3>
						<p className='stat-number'>567</p>
					</div>
					<div className='stat-card'>
						<h3>Total Orders</h3>
						<p className='stat-number'>890</p>
					</div>
					<div className='stat-card'>
						<h3>Revenue</h3>
						<p className='stat-number'>$12,345</p>
					</div>
				</div>

				<div className='dashboard-content'>
					<h2>Recent Activities</h2>
					<div className='activity-list'>
						<p>Recent activities will be displayed here...</p>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Dashboard;
