import React, { useState } from 'react';
import { MainLayout } from '../../layouts';
import { Table, Button, Modal } from '../../components';
import type { User } from '../../interfaces';

const Users: React.FC = () => {
	const [users] = useState<User[]>([
		{
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
			role: 'user',
			status: 'active',
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01',
		},
		{
			id: '2',
			name: 'Jane Smith',
			email: 'jane@example.com',
			role: 'admin',
			status: 'active',
			createdAt: '2024-01-02',
			updatedAt: '2024-01-02',
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const columns = [
		{ key: 'name', title: 'Name' },
		{ key: 'email', title: 'Email' },
		{ key: 'role', title: 'Role' },
		{ key: 'status', title: 'Status' },
		{ key: 'createdAt', title: 'Created At' },
		{
			key: 'actions',
			title: 'Actions',
			render: () => (
				<div>
					<Button variant='primary' onClick={() => {}}>
						Edit
					</Button>
					<Button variant='danger' onClick={() => {}}>
						Delete
					</Button>
				</div>
			),
		},
	];

	return (
		<MainLayout title='Users Management'>
			<div className='users-page'>
				<div className='page-header'>
					<h2>Users</h2>
					<Button onClick={() => setIsModalOpen(true)}>Add User</Button>
				</div>

				<Table columns={columns} data={users} />

				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title='Add New User'
				>
					<p>Add user form will be here...</p>
				</Modal>
			</div>
		</MainLayout>
	);
};

export default Users;
