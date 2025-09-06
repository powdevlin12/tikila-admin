import React from 'react';

interface TableColumn {
	key: string;
	title: string;
	render?: (value: any, record: any) => React.ReactNode;
}

interface TableProps {
	columns: TableColumn[];
	data: any[];
	loading?: boolean;
	onRowClick?: (record: any) => void;
	className?: string;
}

const Table: React.FC<TableProps> = ({
	columns,
	data,
	loading = false,
	onRowClick,
	className = '',
}) => {
	if (loading) {
		return <div className='table-loading'>Loading...</div>;
	}

	return (
		<div className={`table-container ${className}`}>
			<table className='table'>
				<thead>
					<tr>
						{columns.map(column => (
							<th key={column.key}>{column.title}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((record, index) => (
						<tr
							key={index}
							onClick={() => onRowClick && onRowClick(record)}
							className={onRowClick ? 'clickable' : ''}
						>
							{columns.map(column => (
								<td key={column.key}>
									{column.render
										? column.render(record[column.key], record)
										: record[column.key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
