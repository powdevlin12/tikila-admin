import React, { useState } from 'react';
import {
	Form,
	Input,
	Button,
	Card,
	Typography,
	message,
	DatePicker,
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import type { RegisterRequest } from '../../interfaces/auth';
import dayjs from 'dayjs';
import './Register.css';

const { Title, Text } = Typography;

const Register: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuthStore();

	const onFinish = async (
		values: RegisterRequest & {
			confirm_password: string;
			date_of_birth: dayjs.Dayjs;
		},
	) => {
		setLoading(true);
		try {
			const registerData: RegisterRequest = {
				...values,
				date_of_birth: values.date_of_birth.format('YYYY-MM-DD'),
			};

			const response = await authService.register(registerData);

			if (response.result) {
				const { access_token, user } = response.result;
				login(user, access_token);
				message.success('Đăng ký thành công!');
				navigate('/admin');
			}
		} catch (error: unknown) {
			console.error('Register error:', error);
			const errorMessage =
				error instanceof Error && 'response' in error && error.response
					? (error.response as { data?: { message?: string } })?.data?.message
					: error instanceof Error
					? error.message
					: 'Đăng ký thất bại. Vui lòng thử lại!';

			message.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='register-container'>
			<Card className='register-card'>
				<div className='register-header'>
					<Title level={2} className='register-title'>
						Đăng ký Admin
					</Title>
					<Text type='secondary'>Tạo tài khoản admin mới</Text>
				</div>

				<Form
					name='register'
					className='register-form'
					onFinish={onFinish}
					layout='vertical'
					requiredMark={false}
				>
					<Form.Item
						label='Họ và tên'
						name='name'
						rules={[
							{ required: true, message: 'Vui lòng nhập họ và tên!' },
							{ min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
						]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder='Nhập họ và tên của bạn'
							size='large'
						/>
					</Form.Item>

					<Form.Item
						label='Email'
						name='email'
						rules={[
							{ required: true, message: 'Vui lòng nhập email!' },
							{ type: 'email', message: 'Email không hợp lệ!' },
						]}
					>
						<Input
							prefix={<MailOutlined />}
							placeholder='Nhập email của bạn'
							size='large'
						/>
					</Form.Item>

					<Form.Item
						label='Ngày sinh'
						name='date_of_birth'
						rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
					>
						<DatePicker
							placeholder='Chọn ngày sinh'
							size='large'
							style={{ width: '100%' }}
							format='DD/MM/YYYY'
						/>
					</Form.Item>

					<Form.Item
						label='Mật khẩu'
						name='password'
						rules={[
							{ required: true, message: 'Vui lòng nhập mật khẩu!' },
							{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder='Nhập mật khẩu của bạn'
							size='large'
						/>
					</Form.Item>

					<Form.Item
						label='Xác nhận mật khẩu'
						name='confirm_password'
						dependencies={['password']}
						rules={[
							{ required: true, message: 'Vui lòng xác nhận mật khẩu!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error('Mật khẩu xác nhận không khớp!'),
									);
								},
							}),
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder='Nhập lại mật khẩu của bạn'
							size='large'
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							className='register-button'
							size='large'
							loading={loading}
							block
						>
							Đăng ký
						</Button>
					</Form.Item>
				</Form>

				<div className='register-footer'>
					<Text type='secondary'>
						Đã có tài khoản?{' '}
						<Button
							type='link'
							onClick={() => navigate('/login')}
							className='login-link'
						>
							Đăng nhập ngay
						</Button>
					</Text>
				</div>
			</Card>
		</div>
	);
};

export default Register;
