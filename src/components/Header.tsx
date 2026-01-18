/** biome-ignore-all lint/a11y/noSvgWithoutTitle: svg */

import { useUser } from "../hooks/auth";

export function Header() {
	const { userInfo } = useUser();

	const getInitials = (name: string) => {
		const names = name.split(" ");
		if (names.length >= 2) {
			return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`;
		}
		return name.charAt(0);
	};

	// Verifica se tem foto do Google
	const hasGooglePhoto = userInfo?.user?.photoURL;

	return (
		<header className="w-full bg-(--bg-primary) py-2 px-6 border-b border-gray-200">
			<div>
				<div className="flex justify-between items-center h-16">
					{/* Logo e Nome */}
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">
								Expense Tracker
							</h1>
							<p className="text-xs text-gray-500 hidden sm:block">
								Gerencie suas finanças
							</p>
						</div>
					</div>

					{/* Menu do Usuário */}
					<div className="relative">
						<button
							type="button"
							className="flex items-center space-x-3 hover:bg-gray-50 rounded-full px-3 py-2 transition-colors duration-200"
						>
							<div className="hidden sm:block text-right">
								<p className="text-sm font-semibold text-gray-700">
									{userInfo?.user?.name || "Usuário"}
								</p>
								<p className="text-xs text-gray-500">
									{userInfo?.user?.email || "user@email.com"}
								</p>
							</div>
							
							{/* Avatar - Foto do Google ou Iniciais */}
							{hasGooglePhoto ? (
								<img
									src={userInfo.user.photoURL}
									alt={userInfo?.user?.name || "Usuário"}
									className="w-10 h-10 rounded-full object-cover shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer ring-2 ring-emerald-400"
								/>
							) : (
								<div className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-emerald-400 to-teal-500 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
									{userInfo?.user?.name ? getInitials(userInfo.user.name) : "U"}
								</div>
							)}
						</button>
					</div>
				</div>
			</div>

			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.2s ease-out;
				}
			`}</style>
		</header>
	);
}

export default Header;