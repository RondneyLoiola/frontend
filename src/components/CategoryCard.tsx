interface CategoryCardProps {
	name: string;
	color: string;
	description: string;
	example: string;
}

export function CategoryCard({
	name,
	color,
	description,
	example,
}: CategoryCardProps) {
	return (
		<div className="group cursor-pointer">
			<div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform ">
				<div
					className="w-full h-56 flex flex-col justify-center items-center p-6 relative"
					style={{ backgroundColor: color }}
				>
					{/* Efeito de brilho no hover */}
					<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

					{/* Conteúdo */}
					<div className="relative z-10 text-center space-y-3">
						<h3 className="text-2xl font-bold text-white drop-shadow-lg">
							{name}
						</h3>

						<p className="text-white/90 text-sm font-medium leading-relaxed max-w-xs">
							{description}
						</p>

						<div className="pt-2">
							<span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold border border-white/30">
								Ex: {example}
							</span>
						</div>
					</div>

					<div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
					<div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-tr-full"></div>
				</div>
			</div>
		</div>
	);
}
