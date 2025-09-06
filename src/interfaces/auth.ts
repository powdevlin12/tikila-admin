export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	data: {
		access_token: string;
		refresh_token: string;
		user: User;
	};
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
	date_of_birth: string;
}

export interface RegisterResponse {
	message: string;
	result: {
		access_token: string;
		refresh_token: string;
		user: User;
	};
}

export interface User {
	_id: string;
	name: string;
	email: string;
	date_of_birth: string;
	verify: number;
	twitter_circle: string[];
	bio: string;
	location: string;
	website: string;
	username: string;
	avatar: string;
	cover_photo: string;
	created_at: string;
	updated_at: string;
}

export interface GetMeResponse {
	message: string;
	result: User;
}
