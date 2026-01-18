interface CardProps {
	title: string;
	subtitle: string;
	value: string | number;
	icon: React.ReactNode;
	className: string;
}

export function Card({ title, subtitle, value, icon, className }: CardProps) {
	return (
		<div className="pt-2 pb-2">
			<div className="bg-(--bg-primary) rounded-md flex w-80 justify-between px-6 py-6 border border-(--border-color)">
				<div className="flex flex-col gap-2">
					<p>{title}</p>
					<b className="text-2xl font-bold">{value}</b>
					<p>{subtitle}</p>
				</div>
                <div className={`${className} relative bottom-2 w-10 h-10 p-2 flex items-center justify-center rounded-full`}>
                    {icon}
                </div>
			</div>
		</div>
	);
}
