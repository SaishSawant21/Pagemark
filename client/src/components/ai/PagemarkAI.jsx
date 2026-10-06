import {
	useEffect,
	useRef,
	useState,
} from "react";
import { Button, Input, Typography } from "antd";
import { chatWithAI } from "../../services/aiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

const PROMPTS = [
	{
		label: "What's on the shelf?",
		prompt:
			"What books are currently on the PageMark shelf?",
	},
	{
		label: "Highest rated?",
		prompt:
			"Which books on the PageMark shelf have the highest ratings?",
	},
	{
		label: "What should I explore?",
		prompt:
			"Which book from the PageMark shelf would you recommend exploring first, and why?",
	},
	{
		label: "Genres",
		prompt:
			"What genres are represented on the PageMark shelf?",
	},
	{
		label: "Shelf overview",
		prompt:
			"Give me an overview of the books currently on the PageMark shelf.",
	},
];

const BOOK_PROMPTS = [
	{
		label: "What is this book about?",
		prompt: "What is this book about?",
	},
	{
		label: "Key ideas",
		prompt: "What are the key ideas or themes in this book?",
	},
	{
		label: "Why should I read it?",
		prompt: "Why might someone want to read this book?",
	},
	{
		label: "Tell me about the notes",
		prompt: "What do PageMark's notes say about this book?",
	},
];

const PageMarkAI = ({
	book = null,
	open = false,
	onClose,
	showLauncher
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const activePrompts = book ? BOOK_PROMPTS : PROMPTS;
	const messagesContainerRef = useRef(null);

	useEffect(() => {
		if (open) {
			setIsOpen(true);
		}
	}, [open]);

	useEffect(() => {
		if (open && book) {
			setMessages([]);
			setInput("");
		}
	}, [open, book]);

	useEffect(() => {
		const container = messagesContainerRef.current;

		if (!container) {
			return;
		}

		const frame = requestAnimationFrame(() => {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: "smooth",
			});
		});

		return () => cancelAnimationFrame(frame);
	}, [messages, isLoading]);

	const handleClose = () => {
		setIsOpen(false);

		if (onClose) {
			onClose();
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const text = input.trim();

		if (!text || isLoading) {
			return;
		}

		setMessages((previous) => [
			...previous,
			{
				role: "user",
				content: text,
			},
		]);

		setInput("");
		setIsLoading(true);

		try {
			const response = await chatWithAI(text, book);

			setMessages((previous) => [
				...previous,
				{
					role: "assistant",
					content: response.response,
				},
			]);
		} catch (error) {
			console.error("PageMark AI error:", error);

			setMessages((previous) => [
				...previous,
				{
					role: "assistant",
					content:
						"Sorry, I couldn't generate a response right now. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePromptClick = (prompt) => {
		setInput(prompt);
	};

	return (
		<div className="fixed bottom-5 right-5 z-50">
			{/* Launcher */}
			{(!isOpen && showLauncher )&& (
				<Button
					type="primary"
					size="large"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 24 24"
							width="18"
							height="18"
						>
							<path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
						</svg>
					}
					onClick={() => setIsOpen(true)}
					className="!flex !h-11 !items-center !gap-1 !rounded-full !border-[#1E2832] !bg-[#1E2832] !px-4 !text-[#F5C842] !shadow-lg hover:!border-slate-700 hover:!bg-slate-700"
				>
					Ask AI
				</Button>
			)}

			{/* Panel */}
			{isOpen && (
				<div className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E2832] text-[#F5C842]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									width="16"
									height="16"
								>
									<path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
								</svg>
							</div>

							<div>
								<Title
									level={5}
									className="!mb-0 !text-[#1E2832]"
								>
									PageMark AI
								</Title>

								<Text className="!text-xs !text-slate-400">
									Your reading companion
								</Text>
							</div>
						</div>

						<Button
							type="text"
							shape="circle"
							aria-label="Close PageMark AI"
							onClick={handleClose}
							icon={
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
									width="18"
									height="18"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							}
							className="!text-slate-400 hover:!bg-slate-100 hover:!text-[#1E2832]"
						/>
					</div>

					{/* Messages */}
					<div
						ref={messagesContainerRef}
						className="flex h-[360px] flex-col overflow-y-auto px-4 py-5"
					>
						{messages.length === 0 ? (
							<div className="flex flex-1 flex-col items-center justify-center text-center">
								<div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF9E7] text-[#1E2832]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="1.5"
										width="28"
										height="28"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v-14.25"
										/>
									</svg>
								</div>

								<Title
									level={5}
									className="!mb-1 !text-[#1E2832]"
								>
									PageMark AI
								</Title>

								<Paragraph className="!mb-5 !max-w-xs !text-xs !leading-relaxed !text-slate-400">
									Ask about the books on PageMark, discover what's available, or explore ideas from the collection.
								</Paragraph>

								<div className="flex flex-wrap justify-center gap-2">
									{activePrompts.map((item) => (
										<Button
											key={item.label}
											size="small"
											type="default"
											onClick={() =>
												handlePromptClick(
													item.prompt
												)
											}
											className="!rounded-full !border-slate-200 !text-xs !text-slate-600 hover:!border-[#1E2832] hover:!text-[#1E2832]"
										>
											{item.label}
										</Button>
									))}
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								{messages.map((message, index) => (
									<div
										key={`${message.role}-${index}`}
										className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[85%] rounded-2xl text-sm leading-relaxed ${message.role === "user"
												? "rounded-br-md bg-[#1E2832] text-white px-4 py-2.5"
												: "rounded-bl-md bg-slate-100 text-slate-700 px-4 py-3"
												}`}
										>
											{message.role === "assistant" ? (
												<ReactMarkdown
													remarkPlugins={[remarkGfm]}
													components={{
														p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
														ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
														ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
														li: ({ children }) => <li className="mb-1">{children}</li>,
														strong: ({ children }) => <strong className="font-semibold text-[#1E2832]">{children}</strong>,
													}}
												>
													{message.content}
												</ReactMarkdown>
											) : (
												message.content
											)}
										</div>
									</div>
								))}

								{isLoading && (
									<div className="flex justify-start">
										<div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
											<div className="flex items-center gap-1.5">
												<span className="h-2 w-2 animate-bounce rounded-full bg-[#F5C842]" />
												<span className="h-2 w-2 animate-bounce rounded-full bg-[#F5C842] [animation-delay:150ms]" />
												<span className="h-2 w-2 animate-bounce rounded-full bg-[#F5C842] [animation-delay:300ms]" />
											</div>
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Input */}
					<form
						onSubmit={handleSubmit}
						className="border-t border-slate-200 bg-slate-50 p-3"
					>
						<div className="flex items-end gap-2">
							<TextArea
								value={input}
								onChange={(event) =>
									setInput(event.target.value)
								}
								placeholder="Ask PageMark AI..."
								autoSize={{
									minRows: 1,
									maxRows: 4,
								}}
								onPressEnter={(event) => {
									if (!event.shiftKey) {
										event.preventDefault();
										handleSubmit(event);
									}
								}}
								className="!resize-none"
							/>

							<Button
								htmlType="submit"
								type="primary"
								shape="circle"
								aria-label="Send"
								disabled={!input.trim() || isLoading}
								icon={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										width="16"
										height="16"
									>
										<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
									</svg>
								}
								style={{
									backgroundColor: "#1E2832",
									borderColor: "#1E2832",
									color: "#F5C842",
									width: 40,
									height: 40,
									flexShrink: 0,
								}}
							/>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default PageMarkAI;
