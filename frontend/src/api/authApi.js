import API from '../services/axios'

const AUTH_TOKEN_KEY = 'genwin_access_token'
const REFRESH_TOKEN_KEY = 'genwin_refresh_token'

export const saveAuthTokens = ({ access_token, refresh_token, remember = false }) => {
	const storage = remember ? localStorage : sessionStorage

	if (access_token) {
		storage.setItem(AUTH_TOKEN_KEY, access_token)
	}

	if (refresh_token) {
		storage.setItem(REFRESH_TOKEN_KEY, refresh_token)
	}

	return { access_token, refresh_token }
}

export const login = async ({ email, password }) => {
	const response = await API.post('/auth/login', {
		email,
		password,
	})

	return response.data
}

export const register = async ({ email, full_name, password }) => {
	const response = await API.post('/auth/register', {
		email,
		full_name,
		password,
	})

	return response.data
}

export const logout = async (refresh_token) => {
	const response = await API.post('/auth/logout', {
		refresh_token,
	})

	return response.data
}

export const refreshToken = async (refresh_token) => {
	const response = await API.post('/auth/refresh', {
		refresh_token,
	})

	return response.data
}

export const getStoredAuthTokens = () => ({
	access_token:
		localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY),
	refresh_token:
		localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY),
})

export const clearAuthTokens = () => {
	localStorage.removeItem(AUTH_TOKEN_KEY)
	localStorage.removeItem(REFRESH_TOKEN_KEY)
	sessionStorage.removeItem(AUTH_TOKEN_KEY)
	sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}
