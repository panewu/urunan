import { useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewExpenseContext } from "src/context";
import { DropDown } from "../widgets/dropDown";
import { Checkbox } from "../widgets/checkbox";
import currency from "currency.js";
import classNames from "classnames";
import { buttonDisabledArguments } from "src/utils";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { expenseDetailSchema } from "src/model/schema";
import { ErrorMessage } from "@hookform/error-message";

export function NewExpense() {

    const methods = useForm({
        resolver: yupResolver(expenseDetailSchema),
        defaultValues: {
            title: undefined,
            description: '',
            amount: undefined,
            currency: undefined,
            timestamp: 0,
            tag: [],
            split_mode: 'evenly',
            debtor: [],
        },
        mode: 'onBlur',
    });
    const [saveDisabled, setSaveDisabled] = useState(false);

    const saveClicked = (form: any) => {
        console.log("save clicked", form);
    };

    const contextVal = useMemo(() => {
        return {
            disabledSaveButton: saveDisabled,
            setDisabledSaveButton: setSaveDisabled
        };
    }, [saveDisabled]);

    return (
        <NewExpenseContext.Provider value={contextVal}>
            <FormProvider {...methods}>
                <div className="bg-gray-400 min-h-lvh">
                    <form onSubmit={methods.handleSubmit(saveClicked)}>
                        <Header />
                        <div className="container mx-auto">
                            <div className="p-6">
                                <ExpenseDetail />
                            </div>
                        </div>
                    </form>
                </div>
            </FormProvider>
        </NewExpenseContext.Provider>
    );
}

function ExpenseDetail() {
    const { register, setValue, trigger, formState: { errors } } = useFormContext();

    return (
        <div className="p-6 lg:px-72 space-y-2 flex flex-col border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-gray-100">

            <div className="flex flex-col">
                <input
                    {...register('title')}
                    inputMode="text"
                    className=
                    "border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    placeholder="Title"
                />
                <ErrorMessage
                    name="title"
                    errors={errors}
                    render={({ message }) =>
                        <p className="text-red-500 font-semibold text-xs">{message}</p>
                    }
                />
            </div>

            <div className="flex flex-col">
                <input
                    {...register('amount')}
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
                <ErrorMessage
                    name="amount"
                    errors={errors}
                    render={({ message }) =>
                        <p className="text-red-500 font-semibold text-xs">{message}</p>
                    }
                />
            </div>
            <div className="flex flex-row space-x-5 items-center justify-between">
                <div>
                    <DropDown
                        name="currency"
                        defaultLabel="Currency"
                        items={[
                            { name: 'IDR', label: 'IDR' },
                            { name: 'USD', label: 'USD' },
                            { name: 'EUR', label: 'EUR' },
                        ]}
                        onItemSelected={(item) => {
                            setValue('currency', item.name);
                            trigger('currency');
                        }}
                    />
                    <ErrorMessage
                        name="currency"
                        errors={errors}
                        render={({ message }) =>
                            <p className="text-red-500 font-semibold text-xs">{message}</p>
                        }
                    />
                </div>

                <div className="flex flex-row space-x-2 items-center">
                    <Checkbox
                        checked={true}
                        onChecked={(checked) => {
                            setValue('split_mode', checked ? 'evenly' : 'portion');
                        }}
                        disabled={true}
                    />
                    <span className="text-black">Distribute Evenly</span>
                </div>
            </div>
            <h1 className="text-black text-xl font-semibold text-center">Split for</h1>
            <SplitDebtorList />
        </div>

    );
}

function SplitDebtorList() {

    return (
        <div className="p-6 space-y-2 flex flex-col border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-gray-100">
            <div className="flex flex-wrap overflow-auto whitespace-nowrap w-auto justify-center">
                {Array.from({ length: 22 }, (_, index) => (
                    <div key={index} className="flex flex-col items-center p-1">
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
    );
}

function Header() {

    const navigate = useNavigate();
    const { formState: { isDirty, isValid, isSubmitting } } = useFormContext();
    const saveDisabled = !isDirty || isSubmitting;

    return (
        <header className="h-70 flex flex-row justify-between items-center bg-lime-500 text-black border-black border-b-2 p-2.5">
            <h1 className="text-2xl font-black" onClick={(e) => navigate('/')}>URUNAN</h1>
            <input
                type="submit"
                disabled={saveDisabled && false}
                className={classNames("font-bold border-black border-2 p-2.5 w-28 bg-emerald-500 enabled:hover:bg-emerald-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] enabled:active:bg-emerald-700",
                    ...buttonDisabledArguments(saveDisabled))}
                value="Save"
            />
        </header>
    );
};