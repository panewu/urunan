import { useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewExpenseContext } from "src/context";
import { DropDown } from "../widgets/dropDown";
import { Checkbox } from "../widgets/checkbox";
import currency from "currency.js";

export function NewExpense() {

    const [saveDisabled, setSaveDisabled] = useState(false);

    const saveClicked = useCallback(() => {
        console.log("save clicked");
    }, []);

    const contextVal = useMemo(() => {
        return {
            onSaveClicked: saveClicked,
            disabledSaveButton: saveDisabled,
            setDisabledSaveButton: setSaveDisabled
        };
    }, [saveDisabled, saveClicked]);

    return (
        <NewExpenseContext.Provider value={contextVal}>
            <div className="bg-gray-400 min-h-lvh">
                <Header />
                <div className="container mx-auto">
                    <div className="pb-6 pt-4 px-4">
                        <ExpenseDetail />
                    </div>
                </div>
            </div>
        </NewExpenseContext.Provider>
    );
}

function ExpenseDetail() {
    return (
        <form>
            <div className="p-4 space-y-2 flex flex-col border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-gray-100">

                <input
                    name="title"
                    inputMode="text"
                    className=
                    "border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    placeholder="Title"
                />
                <div className="flex flex-row space-x-2 items-center">
                    <input
                        name="amount"
                        inputMode="decimal"
                        className=
                        "flex-grow border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        placeholder="Amount"
                        onChange={(e) => {
                            const input = e.target;
                            const selectionStart = input.selectionStart;
                            const val = currency(input.value, { symbol: '' });
                            input.value = val.format();
                            input.setSelectionRange(selectionStart, selectionStart);
                        }}
                    />
                </div>
                <div className="flex flex-row space-x-5 items-center justify-between">
                    <DropDown
                        defaultLabel="Currency"
                        items={[
                            { name: 'IDR', label: 'IDR' },
                            { name: 'USD', label: 'USD' },
                            { name: 'EUR', label: 'EUR' },
                        ]}
                        onItemSelected={() => { }} />
                    <div className="flex flex-row space-x-2 items-center">
                        <Checkbox
                            checked={true}
                            onChecked={(checked) => { }}
                            disabled={true}
                        />
                        <span className="text-black">Distribute Evenly</span>
                    </div>
                </div>
                <h1 className="text-black text-xl font-semibold text-center">Split for</h1>
                <div className="flex flex-row">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div key={index} className="items-center flex flex-col">
                            <img
                                src="https://thenational-the-national-prod.cdn.arcpublishing.com/resizer/v2/JY63BH7DXZC33K4TARQXIN3X34.jpg?smart=true&auth=0c17d44312353c4c8dd807c19ced8c007c671a84d05c136ea71fa6b36b5e5737&width=100&height=100"
                                className="rounded-full w-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] "
                                alt="Profile"
                            />
                            <div className="text-sm">Joe</div>
                        </div>
                    ))}
                </div>
            </div>
        </form>

    );
}

interface HeaderProps {
    onSaveClicked: () => void;
    disabledSaveButton: boolean;
}

function Header() {

    const navigate = useNavigate();
    const { onSaveClicked, disabledSaveButton } = useContext(NewExpenseContext);

    const onSaveButtonClicked = (e: any) => {
        e.preventDefault();
        onSaveClicked();
    };
    return (
        <header className="h-70 flex flex-row justify-between items-center bg-lime-500 text-black border-black border-b-2 p-2.5">
            <h1 className="text-2xl font-black" onClick={(e) => navigate('/')}>URUNAN</h1>
            <button
                onClick={onSaveButtonClicked}
                disabled={disabledSaveButton}
                className="font-bold border-black border-2 p-2.5 bg-emerald-500 hover:bg-emerald-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-emerald-700"
            >
                Save
            </button>
        </header>
    );
};