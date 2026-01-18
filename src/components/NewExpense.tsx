import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import api from "../services/api";

const expenseSchema = z.object({
	name: z.string().min(1, "Descrição é obrigatória"),
	amount: z.coerce.number().positive("Valor deve ser positivo"),
	category: z.string().min(1, "Categoria é obrigatória"),
	date: z.string().min(1, "Data é obrigatória"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface CategoriesData {
	_id: string;
	name: string;
	color: string;
}

interface NewExpenseProps {
	onExpenseCreated?: () => void;
}

export default function NewExpense({ onExpenseCreated }: NewExpenseProps) {
	const [categories, setCategories] = useState<CategoriesData[]>([]);

	useEffect(() => {
		const getCategories = async () => {
			try {
				const { data } = await api.get("/categories");
				setCategories(data);
			} catch (error) {
				console.error("Erro ao buscar categorias:", error);
				toast.error("Erro ao carregar categorias!");
			}
		};

		getCategories();
	}, []);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<
		z.input<typeof expenseSchema>,
		z.output<typeof expenseSchema>,
		z.output<typeof expenseSchema>
	>({
		resolver: zodResolver(expenseSchema),
		defaultValues: {
			name: "",
			amount: "",
			category: "",
			date: new Date().toISOString().split("T")[0],
		},
	});

	const onSubmit = async (data: ExpenseFormData) => {
		try {
			const { status } = await api.post(
				"/expenses",
				{
					name: data.name,
					amount: data.amount,
					category: data.category,
					date: new Date(data.date).toISOString(),
				},
				{
					validateStatus: () => true,
				},
			);

			if (status === 201) {
				toast.success("Despesa adicionada com sucesso!");
				reset();
				
				// Avisa o componente pai que uma despesa foi criada
				if (onExpenseCreated) {
					onExpenseCreated();
				}
			} else {
				toast.error("Erro ao adicionar despesa!");
			}
		} catch (error) {
			console.error("Erro ao adicionar despesa:", error);
			toast.error("Erro no servidor! Tente novamente.");
		}
	};

	return (
		<div className="w-[70%] flex items-center justify-center border border-gray-200">
			<div className="w-full bg-white rounded-lg shadow-md p-8">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">
					Adicionar Despesa
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Descrição */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Descrição
						</label>
						<input
							id="name"
							type="text"
							placeholder="Ex: Supermercado"
							{...register("name")}
							className={`${
								errors.name
									? "border-2 border-red-500"
									: "border border-gray-300"
							} w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
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
							placeholder="0.00"
							step="0.01"
							{...register("amount")}
							className={`${
								errors.amount
									? "border-2 border-red-500"
									: "border border-gray-300"
							} w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
						/>
						{errors.amount && (
							<p className="mt-1 text-sm text-red-500">
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
							className={`${
								errors.category
									? "border-2 border-red-500"
									: "border border-gray-300"
							} w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white`}
						>
							<option value="">Selecione uma categoria</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>
						{errors.category && (
							<p className="mt-1 text-sm text-red-500">
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
							className={`${
								errors.date
									? "border-2 border-red-500"
									: "border border-gray-300"
							} w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
						/>
						{errors.date && (
							<p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
						)}
					</div>

					{/* Botão de Submit */}
					<button
						type="submit"
						className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
					>
						<Plus size={20} />
						Adicionar Despesa
					</button>
				</form>
			</div>
		</div>
	);
}