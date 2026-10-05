import { Card, Rate, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const BookCard = ({ book }) => {
	const navigate = useNavigate();

	const cover = (
		<div className="relative h-56 bg-[#FEF9E7] overflow-hidden flex items-center justify-center">
			{book.cover_id ? (
				<>
					<div className="absolute inset-0 bg-slate-200 animate-pulse" />
					<img
						src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
						alt={`${book.title} cover`}
						className="h-full w-full object-cover opacity-0 transition-opacity duration-300 relative z-10"
						onLoad={(e) => {
							e.target.classList.remove("opacity-0");
							e.target.previousElementSibling?.remove();
						}}
						onError={(e) => {
							e.target.remove();
							e.target.previousElementSibling?.remove();
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
					className="h-14 w-14 text-slate-300"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
					/>
				</svg>
			)}

			{/* Rating badge */}
			<div className="absolute top-2 right-2 z-20 bg-[#1E2832]/80 backdrop-blur-sm text-[#F5C842] text-xs font-semibold px-2 py-0.5 rounded-full">
				★ {book.rating}/5
			</div>
		</div>
	);

	return (
		<Card
			hoverable
			cover={cover}
			onClick={() => navigate(`/book/${book.id}`)}
			styles={{
				body: { padding: 16 },
			}}
			style={{ borderRadius: 16, overflow: "hidden" }}
			className="!border-slate-200 hover:!border-[#F5C842] hover:!shadow-lg !transition-all !duration-200"
		>
			<div className="flex flex-col gap-2">
				<Text
					strong
					ellipsis={{ tooltip: book.title }}
					className="!text-[#1E2832] !text-sm !leading-snug block"
				>
					{book.title}
				</Text>

				<Text
					ellipsis={{ tooltip: book.author }}
					className="!text-slate-400 !text-xs block"
				>
					{book.author}
				</Text>

				<Rate
					disabled
					value={book.rating}
					count={5}
					style={{ fontSize: 13, color: "#F5C842" }}
				/>
			</div>
		</Card>
	);
}
export default BookCard;
