import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await fetch('http://localhost:8000/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `username=${username}&password=${password}`,
			});
			if (!response.ok) {
				throw new Error('Login failed');
			}
			const data = await response.json();
			localStorage.setItem('accessToken', data.access_token);
			console.log('Login successful:', data);

			router.push('/configuration/warehouse');
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">Login</button>
				{error && <p>{error}</p>}
			</form>
		</div>
	);
}
