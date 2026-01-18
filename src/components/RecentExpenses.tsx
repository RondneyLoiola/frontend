import { BookText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { formatDate } from "../utils/formatDate";

interface ExpenseFormData {
	_id: string;
	name: string;
	amount: number;
	category: {
		_id: string;
		name: string;
		color: string;
	};
	date: string;
}

interface RecentExpenseProps {
	refreshTrigger?: number;
}

export function RecentExpense({ refreshTrigger }: RecentExpenseProps) {
	const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);

	useEffect(() => {
		const getExpenses = async () => {
			try {
				const { data } = await api.get("/expenses/me");
				setExpenses(data.expenses);
			} catch (error) {
				console.error("Erro ao buscar despesas:", error);
				toast.error("Erro ao carregar despesas!");
			}
		};

		getExpenses();
	}, [refreshTrigger]);

	const deleteExpense = async (expenseId: string) => {
		try {
			await api.delete(`/expenses/${expenseId}`);
			setExpenses(expenses.filter((exp) => exp._id !== expenseId));
			toast.success("Despesa deletada com sucesso!");
		} catch (_error) {
			toast.error("Erro ao deletar despesa!");
		}
	};

	const clearAllExpenses = async () => {
		try {
			if (window.confirm("Tem certeza que deseja limpar todas as despesas?")) {
				await api.delete("/expenses/me/all");
				toast.success("Todas as despesas foram removidas!");
				setExpenses([]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="p-6 max-h-screen w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-bold text-gray-900">Despesas Recentes</h2>
				<button
					type="button"
					onClick={clearAllExpenses}
					className="text-red-500 text-sm flex items-center gap-2 font-medium hover:text-red-600 transition-colors"
				>
					<Trash2 size={16} />
					Limpar Tudo
				</button>
			</div>

			<div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
				{expenses.length > 0 ? (
					expenses.map((expense) => (
						<div
							key={expense._id}
							className="w-full flex justify-between items-center border border-gray-200 p-4 rounded-md hover:bg-gray-100 transition-colors"
						>
							<div className="flex items-center gap-4">
								<div>
									<h3 className="font-semibold text-gray-900 mb-0.5">
										{expense.name}
									</h3>
									<div className="flex gap-1 text-sm text-gray-500">
										<p style={{ color: expense.category.color }} className="font-bold">
											{expense.category.name}
										</p>
										•
										<p>{formatDate(expense.date)}</p>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<span className="font-bold text-gray-900">
									R$ {expense.amount.toFixed(2).replace(".", ",")}
								</span>
								<button
									type="button"
									onClick={() => deleteExpense(expense._id)}
									className="w-8 h-8 flex items-center justify-center rounded-full bg-red-200 text-red-500 hover:text-red-700 transition-colors"
								>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					))
				) : (
					<div className="flex justify-center items-center flex-col gap-4 text-gray-400 py-20">
						<BookText size={48} strokeWidth={1.5} />
						<span className="font-semibold text-lg">
							Nenhuma despesa adicionada
						</span>
					</div>
				)}
			</div>
		</div>
	);
}