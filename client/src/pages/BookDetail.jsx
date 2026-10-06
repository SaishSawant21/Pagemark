import { useEffect, useState } from "react";
import { Button, message, Popconfirm, Rate, Spin, Typography } from "antd";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { deleteBook, getBook } from "../services/bookService";

const { Title, Paragraph } = Typography;

const BookDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deleteLoader, setDeleteLoader] = useState(false);
	const [error, setError] = useState("");
	const { handleAskAI } = useOutletContext();

	const deleteBookRecord = async (bookId) => {
		try {
			setDeleteLoader(true);
			const res = await deleteBook(bookId);
			if (res?.code === 200) {
				message.success("Book deleted successfully");
				navigate('/');
			}
		} catch (error) {
			message.error("Something went wrong");
			console.log(error)
		} finally {
			setDeleteLoader(false);
		}
	}
	useEffect(() => {
		const fetchBook = async () => {
			try {
				setLoading(true);
				setError("");

				const data = await getBook(id);

				setBook(data);
			} catch (error) {
				console.error("Failed to fetch book:", error);
				setError("Unable to load this book.");
			} finally {
				setLoading(false);
			}
		};

		fetchBook();
	}, [id]);

	if (loading) {
		return (
			<Spin size="large" >
				<main className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">

				</main>
			</Spin>
		);
	}

	if (error || !book) {
		return (
			<main className="flex min-h-full items-center justify-center bg-[#F8F9FA]">
				<div className="text-center">
					<Paragraph className="!mb-4 !text-slate-500">
						{error || "Book not found."}
					</Paragraph>

					<Button onClick={() => navigate("/")}>
						Back to shelf
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-full bg-[#F8F9FA]">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Back */}
				<div className="mb-6">
					<Button
						type="text"
						onClick={() => navigate("/")}
						className="!px-2 !text-slate-500 hover:!text-[#1E2832]"
					>
						← Back to shelf
					</Button>
				</div>

				{/* Book information */}
				<div className="flex flex-col gap-8 sm:flex-row">
					{/* Cover */}
					<div className="shrink-0">
						<div className="relative flex h-56 w-40 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#FEF9E7] shadow-sm">
							{book.cover_id ? (
								<>
									<div className="absolute inset-0 animate-pulse bg-slate-200" />

									<img
										src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
										alt={`${book.title} cover`}
										className="relative z-10 max-h-full max-w-full object-contain"
										onLoad={(event) => {
											event.currentTarget.previousElementSibling?.remove();
										}}
										onError={(event) => {
											event.currentTarget.remove();
											event.currentTarget.previousElementSibling?.remove();
										}}
									/>
								</>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
									className="h-12 w-12 text-slate-300"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v-14.25"
									/>
								</svg>
							)}
						</div >
					</div >

					{/* Information */}
					< div className="flex flex-col gap-3" >
						<Title
							level={1}
							className="!mb-0 !text-2xl !text-[#1E2832]"
							style={{
								fontFamily: "'Playfair Display', serif",
							}}
						>
							{book.title}
						</Title>

						<Paragraph className="!mb-0 !text-sm !text-slate-500">
							by{" "}
							<span className="text-[#1E2832]">
								{book.author}
							</span>
						</Paragraph>

						{/* Rating */}
						<div className="flex items-center gap-2">
							<Rate
								disabled
								value={book.rating}
								count={5}
								className="!text-base"
							/>

							<span className="text-sm text-slate-400">
								{book.rating}/5
							</span>
						</div>

						{/* Date */}
						{
							book.date_read && (
								<Paragraph className="!mb-0 !text-sm !text-slate-500">
									<span className="mr-1">📅</span>
									Read on{" "}
									<span className="font-medium text-[#1E2832]">
										{new Date(
											book.date_read
										).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
								</Paragraph>
							)
						}

						{/* Genre */}
						{
							book.genre && (
								<div>
									<span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
										{book.genre}
									</span>
								</div>
							)
						}

						{/* Actions */}
						<div className="mt-2 flex flex-wrap gap-3">
							<Button
								type="primary"
								onClick={() =>
									navigate(`/edit-book/${id}`)
								}
								className="!border-[#1E2832] !bg-[#1E2832] !text-white hover:!border-slate-700 hover:!bg-slate-700"
							>
								Edit
							</Button>

							<Button
								type="primary"
								onClick={() => handleAskAI(book)}
								className="!border-[#F5C842] !bg-[#F5C842] !text-[#1E2832] hover:!border-[#e6b932] hover:!bg-[#e6b932]"
							>
								Ask AI about this book
							</Button>

							<Popconfirm
								title="Delete this book?"
								description="Are you sure you want to delete this book?"
								okText="Delete"
								cancelText="Cancel"
								okButtonProps={{ danger: true }}
								onConfirm={() => deleteBookRecord(book.id)}
							>
								<Button
									danger
									loading={deleteLoader}
								>
									Delete
								</Button>
							</Popconfirm>
						</div>
					</div >
				</div >

				{/* Notes */}
				< section className="mt-8" >
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
						My Notes
					</h2>

					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-sm">
						{book.notes || "No notes added yet."}
					</div>
				</section >
			</div >
		</main >
	);
}
export default BookDetail;
