import { Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = () => {
	const navigate = useNavigate();

	return (
		<Footer
			className="!border-t !border-slate-700 !bg-[#1E2832] !px-4 !py-8 sm:!px-6"
		>
			<div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">

				{/* Logo */}
				<div
					className="flex cursor-pointer items-center gap-2"
					onClick={() => navigate("/")}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 24 24"
						className="h-4 w-4 text-[#F5C842]"
					>
						<path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
					</svg>
					<Text
						style={{
							color: "#F5C842",
							fontFamily: "'Playfair Display', serif",
							fontWeight: 600,
							fontSize: 14,
						}}
					>
						PageMark
					</Text>
				</div>

				{/* Tagline */}
				<Text className="!text-xs !text-slate-400">
					Your personal reading shelf.
				</Text>

				{/* Copyright + author */}
				<div className="flex flex-col items-center gap-1 sm:items-end">
					<Text className="!text-xs !text-slate-500">
						© {new Date().getFullYear()} PageMark
					</Text>
					<Text className="!text-xs !text-slate-600">
						Designed & developed by Saish Sawant
					</Text>
				</div>

			</div>
		</Footer>
	);
}
export default AppFooter;
