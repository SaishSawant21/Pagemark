import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getRequest = async(url, config = {}) => {
	const response = await api.get(url, config);

	return response.data;
}

export const postRequest = async (url, data = {}, config = {}) => {
	const response = await api.post(url, data, config);

	return response.data;
}

export const putRequest = async (url, data = {}, config = {}) => {
	const response = await api.put(url, data, config);

	return response.data;
}

export const patchRequest = async (url, data = {}, config = {}) => {
	const response = await api.patch(url, data, config);

	return response.data;
}

export const deleteRequest = async (url, config = {}) => {
	const response = await api.delete(url, config);

	return response.data;
}
export default api;
