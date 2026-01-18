/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */
import { ArrowDown, ChartGantt, List } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import NewExpense from "../components/NewExpense";
import { RecentExpense } from "../components/RecentExpenses";
import { api } from "../services/api";
import { PriceConvert } from "../utils/priceConvert";

interface ExpenseFormData {
	expense: string;
	amount: number;
	category: string;
	date: Date;
}

interface SummaryData {
	totalAmount: number;
	totalExpenses: number;
	filter?: {
		month: number;
		year: number;
	} | null;
}

function Home() {
	const [_expenses, setExpenses] = useState<ExpenseFormData[]>([]);
	const [summary, setSummary] = useState<SummaryData>({
		totalAmount: 0,
		totalExpenses: 0,
	});

	// Estado para o mês e ano selecionados
	const [selectedMonth, _setSelectedMonth] = useState(
		new Date().getMonth() + 1,
	);
	const [selectedYear, _setSelectedYear] = useState(new Date().getFullYear());

	// Estado para forçar atualização da lista de despesas
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	useEffect(() => {
		const getMyExpenses = async () => {
			try {
				const url = `/expenses/me?month=${selectedMonth}&year=${selectedYear}`;
				const { data } = await api.get(url);

				if (!data) {
					throw new Error("Erro ao buscar dados!");
				}

				setExpenses(data.expenses);
				setSummary(data.summary);
			} catch (error) {
				console.error("Erro ao buscar despesas:", error);
			}
		};

		getMyExpenses();
	}, [selectedMonth, selectedYear, refreshTrigger]);

	// Função chamada quando uma nova despesa é criada
	const handleExpenseCreated = () => {
		// Atualiza o trigger para forçar a atualização dos dados
		setRefreshTrigger((prev) => prev + 1);
	};

	return (
		<div className="w-full flex flex-col items-start md:ml-80 pt-6">
			<h1 className="font-bold text-3xl">Calculadora de Despesas</h1>
			<p className="text-gray-600 mt-2">
				Adicione e gerencia suas despesas facilmente
			</p>

			<div>
				<div className="flex gap-6 items-center justify-center">
					<Card
						className="bg-red-200 text-red-500"
						icon={<ArrowDown size={20} />}
						title="Total de Despesas"
						subtitle="Este mês"
						value={PriceConvert(summary.totalAmount)}
					/>
					<Card
						className="bg-blue-200 text-blue-500"
						icon={<List size={20} />}
						title="Número de Despesas"
						subtitle="Transações"
						value={summary.totalExpenses}
					/>
					<Card
						className="bg-green-200 text-green-700"
						icon={<ChartGantt size={20} />}
						title="Média por Despesa"
						subtitle="Valor Médio"
						value={PriceConvert(
							summary.totalExpenses > 0
								? summary.totalAmount / summary.totalExpenses
								: 0.0,
						)}
					/>
				</div>

				<div className="flex gap-3">
					<NewExpense onExpenseCreated={handleExpenseCreated} />
					<RecentExpense refreshTrigger={refreshTrigger} />
				</div>
			</div>
		</div>
	);
}

export default Home;