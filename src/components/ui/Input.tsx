import React from 'react';

interface InputProps {
	label?: string;
	type?: string;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
	required?: boolean;
	className?: string;
}

const Input: React.FC<InputProps> = ({
	label,
	type = 'text',
	placeholder,
	value,
	onChange,
	error,
	required = false,
	className = '',
}) => {
	return (
		<div className={`input-group ${className}`}>
			{label && (
				<label className='input-label'>
					{label}
					{required && <span className='required'>*</span>}
				</label>
			)}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				className={`input ${error ? 'input-error' : ''}`}
			/>
			{error && <span className='error-message'>{error}</span>}
		</div>
	);
};

export default Input;
