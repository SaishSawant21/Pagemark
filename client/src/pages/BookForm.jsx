import { useEffect, useState } from "react";
import {
	Button,
	Col,
	Form,
	Input,
	message,
	Rate,
	Row,
	Select,
	Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { createBook, getBook, getBookCover, updateBook } from "../services/bookService";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const GENRES = [
	{ value: "fiction", label: "Fiction" },
	{ value: "non-fiction", label: "Non-Fiction" },
	{ value: "science", label: "Science" },
	{ value: "history", label: "History" },
	{ value: "biography", label: "Biography" },
	{ value: "self-help", label: "Self Help" },
	{ value: "romance", label: "Romance" },
	{ value: "sci-fi", label: "Sci-Fi" },
	{ value: "motivational", label: "Motivational" },
];

const BookForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = Boolean(id);
	const [form] = Form.useForm();
	const [coverId, setCoverId] = useState(null);
	const [coverLoading, setCoverLoading] = useState(false);
	const [coverError, setCoverError] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	useEffect(() => {
		if (!isEdit) {
			return;
		}

		const loadBook = async () => {
			try {
				const book = await getBook(id);

				form.setFieldsValue({
					title: book.title,
					author: book.author,
					date_read: book.date_read
						? book.date_read.slice(0, 10)
						: undefined,
					genre: book.genre || undefined,
					rating: book.rating || undefined,
					notes: book.notes || "",
					cover_id: book.cover_id || null,
				});

				setCoverId(book.cover_id || null);
			} catch (error) {
				console.error("Load book error:", error);
			}
		};

		loadBook();
	}, [id, isEdit, form]);

	const handleFetchCover = async () => {
		const title = form.getFieldValue("title")?.trim();
		const author = form.getFieldValue("author")?.trim();

		if (!title || !author) {
			return;
		}

		setCoverLoading(true);
		setCoverError(false);

		try {
			const data = await getBookCover(title, author);

			if (data.cover_id) {
				setCoverId(data.cover_id);
				form.setFieldValue("cover_id", data.cover_id);
			} else {
				setCoverId(null);
				form.setFieldValue("cover_id", null);
				setCoverError(true);
			}
		} catch (error) {
			console.error("Fetch cover error:", error);

			setCoverId(null);
			form.setFieldValue("cover_id", null);
			setCoverError(true);
		} finally {
			setCoverLoading(false);
		}
	};

	const handleSubmit = async (values) => {
		setSubmitting(true);

		try {
			const bookData = {
				...values,
				cover_id: coverId,
			};

			if (isEdit) {
				await updateBook(id, bookData);
			} else {
				await createBook(bookData);
			}
			message.success("Action completed successfully");
			navigate("/");
		} catch (error) {
			message.error("Something went wrong");
			console.error(
				isEdit
					? "Update book error:"
					: "Add book error:",
				error
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<main className="min-h-full bg-[#F8F9FA]">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-6">
					<Title
						level={2}
						className="!mb-1 !text-[#1E2832]"
						style={{
							fontFamily: "'Playfair Display', serif",
						}}
					>
						{isEdit ? "Edit Book" : "Add a Book"}
					</Title>

					<Paragraph className="!mb-0 !text-sm !text-slate-500">
						{isEdit
							? "Update your notes or rating"
							: "Log a book you have read"}
					</Paragraph>
				</div>

				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					className="fade-in"
				>
					<Row gutter={[24, 0]}>
						<Col xs={24} md={12}>
							<Form.Item
								label="Title"
								name="title"
								required
								rules={[
									{
										required: true,
										message: "Please enter the book title",
									},
								]}
							>
								<Input
									placeholder="e.g. Deep Work"
									size="large"
								/>
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item
								label="Author"
								name="author"
								required
								rules={[
									{
										required: true,
										message: "Please enter the author",
									},
								]}
							>
								<Input
									placeholder="e.g. Cal Newport"
									size="large"
								/>
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item
								label="Date Read"
								name="date_read"
								required
								rules={[
									{
										required: true,
										message: "Please select the date read",
									},
								]}
							>
								<Input
									type="date"
									size="large"
								/>
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item
								label="Genre"
								name="genre"
							>
								<Select
									placeholder="Select genre"
									size="large"
									allowClear
									options={GENRES}
								/>
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item
								label="Rating"
								name="rating"
								rules={[
									{
										required: true,
										message: "Please select a rating",
									},
								]}
							>
								<Rate />
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item label="Cover Preview">
								<Button
									block
									size="large"
									loading={coverLoading}
									onClick={handleFetchCover}
									className="!border-[#1E2832] !text-[#1E2832] hover:!bg-[#1E2832] hover:!text-[#F5C842]"
								>
									{coverLoading
										? "Fetching..."
										: coverId
											? "✓ Cover Found"
											: "Fetch Cover"}
								</Button>

								<div className="mt-2 flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-[#FEF9E7]">
									{coverId ? (
										<img
											src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
											alt="Book cover"
											className="h-44 w-28 rounded-lg object-cover shadow-sm"
										/>
									) : (
										<span className="px-4 text-center text-xs text-slate-400">
											{coverError
												? "No cover found — book will use default icon."
												: "Cover will appear here"}
										</span>
									)}
								</div>

								<Form.Item
									name="cover_id"
									hidden
								>
									<Input />
								</Form.Item>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						label="Notes"
						name="notes"
						className="!mt-2"
					>
						<TextArea
							rows={5}
							placeholder="What did you take away from this book?"
							className="!resize-none"
						/>
					</Form.Item>

					<div className="mt-6 flex justify-end gap-3">
						<Button
							size="large"
							onClick={() => navigate("/")}
						>
							Cancel
						</Button>

						<Button
							htmlType="submit"
							type="primary"
							size="large"
							loading={submitting}
							className="!border-[#1E2832] !bg-[#1E2832] !text-[#F5C842] hover:!border-slate-700 hover:!bg-slate-700"
						>
							{isEdit ? "Save Changes" : "Save Book"}
						</Button>
					</div>
				</Form>
			</div>
		</main>
	);
}
export default BookForm;
