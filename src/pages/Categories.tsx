import { CategoryCard } from "../components/CategoryCard";

function Categories() {
	return (
		<div className="w-full flex flex-col items-start md:ml-60  pt-6">
			<h1 className="font-bold text-3xl">Categorias</h1>
            <p className="text-gray-600 mt-2">
				Veja todas as Categorias
			</p>

			<div className="mt-6">
				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<CategoryCard
						color="#FF6B6B"
						name="Alimentação"
						description="Todas as despesas relacionadas à comida e bebida consumidas no dia a dia."
						example="Restaurantes, mercados e lanchonetes"
					/>

                    <CategoryCard
						color="#4ECDC4"
						name="Transporte"
						description="Gastos com deslocamento e manutenção de veículos ou uso de serviços de locomoção."
						example="Uber, gasolina e manutenção de veículos"
					/>

                    <CategoryCard
						color="#9B59B6"
						name="Moradia"
						description="Custos fixos e variáveis relacionados à manutenção da casa ou local onde se vive."
						example="Condomínio, aluguel e movéis novos"
					/>

                    <CategoryCard
						color="#4682B4"
						name="Lazer"
						description="Gastos com entretenimento, hobbies e atividades que proporcionam prazer e descanso."
						example="Netflix, cinema e passeios"
					/>

                    <CategoryCard
						color="#32CD32"
						name="Saúde"
						description="Despesas para manter o bem-estar físico e mental, incluindo prevenção e tratamento."
						example="Consultas médicas, academia e cuidado pessoal"
					/>

                    <CategoryCard
						color="#FF8C00"
						name="Investimentos"
						description="Alocação de recursos com o objetivo de gerar retorno financeiro no futuro, preservar ou multiplicar o capital."
						example="Ações, fundos imobiliários e aposentadoria"
					/>
				</div>
			</div>
		</div>
	);
}

export default Categories;
