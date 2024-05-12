import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewExpenseContext } from "src/context";
import { DropDown } from "../widgets/dropDown";
import { Checkbox } from "../widgets/checkbox";
import currency from "currency.js";
import classNames from "classnames";
import { buttonDisabledArguments } from "src/utils";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { expenseDetailSchema } from "src/model/schema";
import { ErrorMessage } from "@hookform/error-message";
import { Modal } from "../widgets/modal";
import { useUser } from "src/hooks/useUser";
import { Avatar, AvatarCheckmark } from "../widgets/avatar";
import { SplitBillDebtor, User } from "@declarations/urunan_backend/urunan_backend.did";
import { toSplitBillDebtor, toSplitBillMode, userToDebtorCandidate } from "src/model/mapper";
import { SplitDebtorCandidates } from "src/model/views";
import CurrencyInput from "react-currency-input-field";
import { useActor } from "src/hooks/useActor";

export function NewExpense() {

    const navigate = useNavigate();
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
        mode: 'onChange',
    });
    const [debtorCandidates, setDebtorCandidates] = useState<SplitDebtorCandidates[]>([]);
    const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
    const { actor } = useActor();

    const saveClicked = async (form: any) => {
        console.log("save clicked", form, debtorCandidates);
        const id = await actor.new_expense({
            title: form.title,
            description: form.description,
            currency: form.currency,
            amount: form.amount,
            timestamp: BigInt(0),
            tag: form.tag,
            split_mode: toSplitBillMode(form.split_mode),
        }, toSplitBillDebtor(debtorCandidates));
        console.log(id);
        setShouldNavigateBack(true);
    };

    const contextVal = useMemo(() => {
        return {
            debtorCandidates,
            setDebtorCandidates,
        };
    }, [debtorCandidates, setDebtorCandidates]);

    useEffect(() => {
        if (shouldNavigateBack) {
            navigate('/');
            setShouldNavigateBack(false);
        }
    }, [shouldNavigateBack]);

    return (
        <NewExpenseContext.Provider value={contextVal}>
            <FormProvider {...methods}>
                <div className="bg-gray-400 min-h-lvh">
                    <form onSubmit={methods.handleSubmit(saveClicked)}>
                        <Header />
                        <div className="container mx-auto">
                            <div className="p-4 space-y-4">
                                <ExpenseDetail />
                                <SplitDebtorList />
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
                <CurrencyInput
                    name="amount"
                    className=
                    "flex-grow border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    placeholder="Amount"
                    decimalScale={2}
                    decimalSeparator="."
                    groupSeparator=","
                    onValueChange={(v, name, values) => {
                        setValue('amount', values?.float);
                        trigger('amount');
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
                    />
                    <span className="text-black">Distribute Evenly</span>
                </div>
            </div>
        </div>

    );
}

function SplitDebtorList() {

    const { peers, user } = useUser();
    const { debtorCandidates, setDebtorCandidates } = useContext(NewExpenseContext);
    const { watch } = useFormContext();

    const [watchedTotalAmount, watchedMode] = watch(['amount', 'split_mode']);

    const defaultDebtorAmount = (totalAmount: number, userCount: number) => {
        if (watchedMode === 'evenly') {
            return totalAmount / userCount;
        }
        return 0;
    };

    const recalculateDebtorAmounts = () => {
        if (debtorCandidates.length <= 0) {
            return;
        }
        const defAmount = defaultDebtorAmount(watchedTotalAmount, debtorCandidates.length);
        setDebtorCandidates((prevValues) => prevValues.map((d) => userToDebtorCandidate(d, defAmount)));
    };

    const onDebtorChecked = (debtor: User) => (checked: boolean) => {
        if (checked) {
            setDebtorCandidates((prevValues) => {
                const defAmount = defaultDebtorAmount(watchedTotalAmount, debtorCandidates.length + 1);
                const recalculatedDebtors = prevValues
                    .map((d) => userToDebtorCandidate(d, defAmount));
                console.log('checked', defAmount, recalculatedDebtors)

                return [...recalculatedDebtors, userToDebtorCandidate(debtor, defAmount)];
            });
        } else {
            setDebtorCandidates((prevValues) => {
                const defAmount = debtorCandidates.length - 1 <= 0 ? 0 : defaultDebtorAmount(watchedTotalAmount, debtorCandidates.length - 1);

                const recalculatedDebtors = prevValues
                    .filter((d) => d.username !== debtor.username)
                    .map((d) => userToDebtorCandidate(d, defAmount));

                console.log('unchecked', defAmount, recalculatedDebtors)
                return [...recalculatedDebtors];
            });
        }
    };

    const calculatePercentage = (amount: number) => {
        if (debtorCandidates.length === 0 || watchedTotalAmount === 0) {
            return 0;
        }
        const percentage = 100 * (amount / watchedTotalAmount);
        return Math.round(percentage);
    };

    useEffect(() => {
        if (!watchedTotalAmount || watchedMode !== 'evenly') {
            return;
        }
        recalculateDebtorAmounts();
    }, [watchedTotalAmount, watchedMode]);

    if (!watchedTotalAmount) {
        return null;
    }

    return (
        <div className="p-6 space-y-2 lg:px-72 flex flex-col border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-gray-100">
            <h1 className="text-black text-xl font-semibold text-center">Split for {debtorCandidates.length} person</h1>
            <div className="flex flex-row items-baseline overflow-x-auto space-x-2 py-1">
                {
                    user && (
                        <AvatarCheckmark
                            avatarUrl={user.avatar}
                            username={user.username}
                            labelName={`${user.username} (You)`}
                            onChecked={onDebtorChecked(user)}
                        />
                    )
                }
                {
                    peers.map((peer) =>
                        <AvatarCheckmark
                            avatarUrl={peer.avatar}
                            username={peer.username}
                            key={peer.username}
                            onChecked={onDebtorChecked(peer)}
                        />
                    )
                }
            </div>
            <div className="flex flex-col space-y-4">

                <div className="flex flex-col">
                    {
                        debtorCandidates.map((debtor, index) => (
                            <div key={debtor.username + watchedMode} className="flex flex-row items-baseline space-x-2 px-3 py-1">
                                <Avatar
                                    avatarUrl={debtor.avatar}
                                    username={debtor.username}
                                    labelName={debtor.username}
                                />
                                {
                                    watchedMode === 'evenly' ?
                                        (
                                            <div className="relative w-full">
                                                <CurrencyInput
                                                    className=
                                                    "border-black ml-2 border-2 rounded-full py-2.5 pr-2.5 pl-16 w-full focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                                    placeholder="Amount"
                                                    decimalScale={2}
                                                    decimalSeparator="."
                                                    groupSeparator=","
                                                    value={debtor.amount}
                                                    disabled

                                                />
                                                <div className="absolute inset-y-2.5 left-2.5 py-1 px-2 rounded-full flex items-center bg-emerald-300 text-sm font-semibold border-black border-2">
                                                    {calculatePercentage(debtor.amount)}%
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="relative w-full">
                                                <CurrencyInput
                                                    className=
                                                    "border-black border-2 rounded-full p-2.5 w-full focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                                    placeholder="Amount"
                                                    decimalScale={2}
                                                    decimalSeparator="."
                                                    groupSeparator=","
                                                    defaultValue={0}
                                                    onValueChange={(v, n, values) => {
                                                        console.log('value changed', values?.value);
                                                    }}
                                                />
                                            </div>
                                        )
                                }


                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

function Header() {

    const navigate = useNavigate();
    const { formState: { isDirty, isValid, isSubmitting } } = useFormContext();
    const saveDisabled = !isDirty || isSubmitting;

    return (
        <header className="sticky top-0 h-70 flex flex-row justify-between items-center bg-lime-500 text-black border-black border-b-2 py-2.5 px-4">
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