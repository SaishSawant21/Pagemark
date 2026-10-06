import { useState, useEffect } from "react";
import { Typography } from "antd";
import BookCard from "../components/BookCard";
import { getBooks } from "../services/bookService";

const { Title, Paragraph } = Typography;

const SORT_OPTIONS = [
	{ label: "Default", value: "default" },
	{ label: "Rating", value: "rating" },
	{ label: "Date Read", value: "date" },
	{ label: "Title A–Z", value: "title" },
];

// Skeleton card
const SkeletonCard = () =>{
	return (
		<div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm animate-pulse">
			<div className="h-56 bg-slate-200" />
			<div className="p-4 flex flex-col gap-3">
				<div className="h-3.5 bg-slate-200 rounded w-3/4" />
				<div className="h-3 bg-slate-200 rounded w-1/2" />
				<div className="h-3 bg-slate-200 rounded w-1/3" />
			</div>
		</div>
	);
}

const Shelf = () => {
	const [sort, setSort] = useState("default");
	const [loading,setLoading]= useState(false); // swap with real loading state
	const [books, setBooks] = useState([]);

	useEffect(() => { 
		async function fetchBooks() {
			 try {
				 setLoading(true); 
				 const data = await getBooks(sort); 
				 setBooks(data); 
				} catch (error) { 
					console.error("Fetch books error:", error); 
				} finally { 
					setLoading(false); 
				} 
			}
			 fetchBooks(); 
			}, 
	[sort]);
	return (
		<main className="min-h-screen bg-[#F8F9FA]">
			<div className="mx-auto max-w-7xl px-6 py-8">

				{/* Page header */}
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<Title
							level={2}
							className="!mb-1 !text-[#1E2832]"
							style={{
								fontFamily: "'Playfair Display', serif",
							}}
						>
							Pagemark Shelf
						</Title>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Paragraph className="!mb-0 !mr-1 !text-xs !text-slate-400">
							Sort by
						</Paragraph>

						{SORT_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => setSort(option.value)}
								className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs transition-all duration-150 ${sort === option.value
										? "border-[#1E2832] bg-[#1E2832] font-medium text-[#F5C842]"
										: "border-slate-300 bg-white text-slate-600 hover:border-[#1E2832] hover:text-[#1E2832]"
									}`}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				{/* Grid */}
				{loading ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<SkeletonCard key={i} />
						))}
					</div>
				) : books?.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{books.map((book, index) => (
							<div
								key={book.id}
								className="fade-in-card"
								style={{ animationDelay: `${index * 60}ms` }}
							>
								<BookCard book={book} />
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-24 gap-4">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
							stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 text-slate-300">
							<path strokeLinecap="round" strokeLinejoin="round"
								d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
						</svg>
								<Paragraph className="!text-slate-400 !text-sm">No books on your shelf yet</Paragraph>
						<a href="/add"
							className="text-sm font-medium px-5 py-2 rounded-lg bg-[#1E2832] text-[#F5C842] hover:bg-slate-700 transition">
							+ Add your first book
						</a>
					</div>
				)}
			</div>
		</main>
	);
}
export default Shelf;
