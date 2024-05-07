export function NewExpense() {
    return (
        <div className="bg-gray-400 min-h-lvh">
            <Header />
            <div className="container mx-auto">
                <div className="pb-6 pt-4 px-4">
                    <ExpenseDetail />
                </div>
            </div>
        </div>
    );
}

function ExpenseDetail() {
    return (
        <div className="p-4 space-x-2 flex flex-row border-black border-2 rounded-md hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-gray-100 hover:bg-gray-200">
        </div>
    );
}

function Header() {
    return (
        <header className="flex flex-row justify-between items-center bg-lime-500 text-black border-black border-b-2 p-2.5">
            <h1 className="text-2xl font-black">URUNAN</h1>
            <button
                className="font-bold border-black border-2 p-2.5 bg-emerald-500 hover:bg-emerald-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-emerald-700"
            >
                Save
            </button>
        </header>
    );
};