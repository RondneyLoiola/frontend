import { Calculator, History, LogOut, Tags } from "lucide-react";

export function SiderBar() {
	return (
		<div className="h-screen bg-(--bg-primary)">
			<div className="flex flex-col h-full">
				{/* Menu Items */}
				<nav className="w-60 flex flex-col gap-2 flex-1">
					<button
						type="button"
						className="flex items-center gap-3 p-6 w-full transition-all duration-200 hover:bg-green-100 text-left group"
					>
						<Calculator
							size={20}
							className="group-hover:text-green-800 transition-colors"
						/>
						<span className="group-hover:text-green-800 transition-colors">
							Despesas
						</span>
					</button>

					<button
						type="button"
						className="flex items-center gap-3 p-6 transition-all duration-200 hover:bg-green-100  text-left w-full group"
					>
						<History
							size={20}
							className="group-hover:text-green-800 transition-colors"
						/>
						<span className="group-hover:text-green-800 transition-colors">
							Histórico
						</span>
					</button>

					<button
						type="button"
						className="flex items-center gap-3 p-6 transition-all duration-200 hover:bg-green-100 text-left w-full group"
					>
						<Tags
							size={20}
							className="group-hover:text-green-800 transition-colors"
						/>
						<span className="group-hover:text-green-800 transition-colors">
							Categorias
						</span>
					</button>

					<button
						type="button"
						className="flex items-center gap-3 px-7 py-6 transition-all duration-200 hover:bg-red-900/20 text-left w-full group  text-red-400"
					>
						<LogOut
							size={20}
							className="group-hover:text-red-300 transition-colors"
						/>
						<span className="group-hover:text-red-300 transition-colors">
							Sair
						</span>
					</button>
				</nav>
			</div>
		</div>
	);
}
