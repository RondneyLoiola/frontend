import { BookText, Trash2 } from "lucide-react";

export function RecentExpense() {
	return (
		<div className="p-8 w-full bg-(--bg-primary) rounded-lg border border-(--border-color)">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-800">Despesas Recentes</h2>
				<button type="button" className="text-red-500 text-center flex gap-2 font-bold" >
					<Trash2 size={20} />
					Limpar Tudo
				</button>
			</div>

            <div className="flex justify-center items-center flex-col gap-4 text-(--bg-secondary) mt-20">
                <BookText size={60}/>
                <span className="font-bold text-2xl">Nenhuma despesa adicionada</span>
            </div>
		</div>
	);
}
