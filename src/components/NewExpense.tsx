import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const expenseSchema = z.object({
	expense: z.string().min(1, "Descrição é obrigatória"),
	amount: z.coerce.number().positive("Valor deve ser positivo"),
	category: z.string().min(1, "Categoria é obrigatória"),
	date: z.coerce.date(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function NewExpense() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<z.input<typeof expenseSchema>, z.output<typeof expenseSchema>, z.output<typeof expenseSchema>>({
		resolver: zodResolver(expenseSchema),
	});

	function onSubmit(data: ExpenseFormData) {
		console.log("Despesa adicionada:", data);
		alert(`Despesa de R$ ${data.amount.toFixed(2)} adicionada com sucesso!`);
		reset();
	}

	return (
		<div className="w-[70%] flex items-center justify-center border border-(--border-color)">
			<div className="w-full bg-white rounded-lg shadow-md p-8">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">
					Adicionar Despesa
				</h2>

				<div className="space-y-6">
					{/* Descrição */}
					<div>
						<label
							htmlFor="expense"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Descrição
						</label>
						<input
							id="expense"
							type="text"
							placeholder="Ex: Supermercado"
							{...register("expense")}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
						/>
						{errors.expense && (
							<p className="mt-1 text-sm text-red-600">
								{errors.expense.message}
							</p>
						)}
					</div>

					{/* Valor */}
					<div>
						<label
							htmlFor="amount"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Valor (R$)
						</label>
						<input
							id="amount"
							type="number"
							step="0.01"
							{...register("amount")}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
						/>
						{errors.amount && (
							<p className="mt-1 text-sm text-red-600">
								{errors.amount.message}
							</p>
						)}
					</div>

					{/* Categoria */}
					<div>
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Categoria
						</label>
						<select
							id="category"
							{...register("category")}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
						>
							<option value="">Selecione uma categoria</option>
							<option value="Alimentação">Alimentação</option>
							<option value="Transporte">Transporte</option>
							<option value="Lazer">Lazer</option>
							<option value="Saúde">Saúde</option>
							<option value="Educação">Educação</option>
							<option value="Moradia">Moradia</option>
							<option value="Outros">Outros</option>
						</select>
						{errors.category && (
							<p className="mt-1 text-sm text-red-600">
								{errors.category.message}
							</p>
						)}
					</div>

					{/* Data */}
					<div>
						<label
							htmlFor="date"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Data
						</label>
						<input
							id="date"
							type="date"
							{...register("date")}
							defaultValue={new Date().toISOString().split("T")[0]}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
						/>
						{errors.date && (
							<p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
						)}
					</div>

					{/* Botão de Submit */}
					<button
						type="submit"
						onClick={handleSubmit(onSubmit)}
						className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
					>
						<Plus size={20}/>
						Adicionar Despesa
					</button>
				</div>
			</div>
		</div>
	);
}
