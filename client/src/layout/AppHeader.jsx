import { Button, Layout, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPage = location?.pathname;
	return (
		<Header
			className="!sticky !top-0 !z-50 !h-16 !border-b !border-slate-200 !bg-[#1E2832] !px-4 sm:!px-6"
			style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.12)" }}
		>
			<div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">

				{/* Logo */}
				<div
					className="flex cursor-pointer items-center gap-2"
					onClick={() => navigate("/")}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 24 24"
						className="h-5 w-5 text-[#F5C842]"
					>
						<path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
					</svg>
					<Title
						level={4}
						className="!mb-0"
						style={{
							color: "#F5C842",
							fontFamily: "'Playfair Display', serif",
						}}
					>
						PageMark
					</Title>
				</div>

				{/* Add Book */}
				{currentPage !== "/add" && <Button
					type="primary"
					onClick={() => navigate("/add")}
					style={{
						backgroundColor: "#F5C842",
						borderColor: "#F5C842",
						color: "#1E2832",
						fontWeight: 600,
						borderRadius: 8,
					}}
				>
					+ Add Book
				</Button>}

			</div>
		</Header>
	);
}
export default AppHeader;
