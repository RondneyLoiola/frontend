import { ArrowDown, ChartGantt, List } from "lucide-react"
import { Card } from "../components/Card"
import NewExpense from "../components/NewExpense"
import { RecentExpense } from "../components/RecentExpenses"

function Home(){
    return (
        <div className="w-full flex flex-col items-start md:ml-80  pt-6">
            <h1 className="font-bold text-3xl">Calculadora de Despesas</h1>
            <p className="text-gray-600 mt-2">Adicione e gerencia suas despesas facilmente</p>

            <div>
                <div className="flex gap-6 items-center justify-center">
                    <Card className="bg-red-200 text-red-500" icon={<ArrowDown size={20} />} title="Total de Despesas" subtitle="Este mês" value="R$ 1.000,00"/>
                    <Card className="bg-blue-200 text-blue-500" icon={<List size={20}/>} title='Número de Despesas' subtitle='Transações' value='10'/>
                    <Card className="bg-green-200 text-green-700" icon={<ChartGantt size={20}/>} title="Total de Despesas" subtitle="Este mês" value="R$ 1.000,00"/>
                </div>

                <div className="flex gap-3 pt-6">
                    <NewExpense/>
                    <RecentExpense/>
                </div>
            </div>
        </div>
    )
}

export default Home