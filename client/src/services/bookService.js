import { deleteRequest, getRequest, postRequest, putRequest } from "./api";

export const getBooks = async (sort = "default") => {
	const config =
		sort === "default"
			? {}
			: {
				params: {
					sort,
				},
			};

	const response = await getRequest("/books", config);

	return response?.data;
}

export const getBook = async (id) => {
	const response = await getRequest(`/books/${id}`);

	return response?.data;
}

export const createBook = async (bookData) => {
	const response = await postRequest("/books", bookData);

	return response?.data;
}

export const getBookCover = async (title, author) => {
	const response = await getRequest("/books/cover", {
		params: {
			title,
			author,
		},
	});

	return response?.data;
}

export const updateBook = async (id, bookData) => {
	const response = await putRequest(
		`/books/${id}`,
		bookData
	);

	return response?.data;
}

export const deleteBook = async (id) => {
	const response = await deleteRequest(
		`/books/${id}`);

	return response?.data;
}