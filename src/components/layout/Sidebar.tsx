import React from 'react';

interface SidebarProps {
	children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
	return (
		<div className='sidebar'>
			<h2>Admin Panel</h2>
			<nav>
				<ul>
					<li>
						<a href='/admin'>Dashboard</a>
					</li>
					<li>
						<a href='/admin/users'>Users</a>
					</li>
					<li>
						<a href='/admin/products'>Products</a>
					</li>
					<li>
						<a href='/admin/orders'>Orders</a>
					</li>
				</ul>
			</nav>
			{children}
		</div>
	);
};

export default Sidebar;
