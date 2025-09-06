import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import type { LoginRequest } from '../../interfaces/auth';
import './Login.css';
import { useState } from 'react';

const { Title, Text } = Typography;

const Login: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuthStore();

	const onFinish = async (values: LoginRequest) => {
		setLoading(true);
		try {
			console.log('Attempting login with values:', values);
			const response = await authService.login(values);
			console.log('Login response:', response);

			if (response.data) {
				const { access_token, user } = response.data;
				console.log('Login successful, user:', user);
				login(user, access_token);
				message.success('Đăng nhập thành công!');
				console.log('Navigating to /admin');
				navigate('/admin');
			}
		} catch (error: unknown) {
			console.error('Login error:', error);
			const errorMessage =
				error instanceof Error && 'response' in error && error.response
					? (error.response as any)?.data?.message
					: error instanceof Error
					? error.message
					: 'Đăng nhập thất bại. Vui lòng thử lại!';

			message.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='login-container'>
			<Card className='login-card'>
				<div className='login-header'>
					<Title level={2} className='login-title'>
						Đăng nhập Admin
					</Title>
					<Text type='secondary'>
						Vui lòng nhập thông tin đăng nhập của bạn
					</Text>
				</div>

				<Form
					name='login'
					className='login-form'
					onFinish={onFinish}
					layout='vertical'
					requiredMark={false}
				>
					<Form.Item
						label='Email'
						name='email'
						rules={[
							{ required: true, message: 'Vui lòng nhập email!' },
							{ type: 'email', message: 'Email không hợp lệ!' },
						]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder='Nhập email của bạn'
							size='large'
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

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							className='login-button'
							size='large'
							loading={loading}
							block
						>
							{loading ? <Spin size='small' /> : 'Đăng nhập'}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default Login;
