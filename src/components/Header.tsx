export function Header(){
    return (
        <div className="w-full bg-(--bg-primary) py-3 px-6 border-b border-gray-300">
            <div className="flex justify-between">
                <h2 className="font-bold text-xl">Expense Tracker</h2>
                <div className="w-8 h-8 flex items-center justify-center bg-green-300 rounded-full font-bold cursor-pointer">R</div>
            </div>
        </div>
    )
}
