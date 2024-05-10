import currency from "currency.js";
import { SetStateAction, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppContext } from "src/context";
import { Modal } from "../widgets/modal";
import { useUser } from "src/hooks/useUser";

export function Home() {
    return (
        <div className="bg-gray-400 min-h-lvh">
            <Header />
            <div className="container mx-auto py-6">

                <DetailActionCard />

                <FriendList />

                <History />
            </div>
        </div>
    );
}
function History() {
    const history = [];
    return (
        <div className="mx-auto p-4">
            <div className="flex flex-row my-2 space-x-2">
                <div className="bg-lime-500 border-black border-2 p-2  flex-grow">
                    <h1 className="text-black text-2xl font-bold ">Split History</h1>
                </div>
                <button
                    className=" border-black border-2 p-2.5 bg-lime-500 hover:bg-lime-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-lime-700"
                >
                    More
                </button>
            </div>
            <div className="space-y-4">
                {Array.from({ length: 22 }, (_, index) => (
                    <div key={index} className="p-4 space-x-2 flex flex-row border-black border-2 rounded-md hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-gray-100 hover:bg-gray-200">
                        <div className="flex-grow">
                            <div className="mb-2 font-bold">Madhang 12 12 12 1 12 12 12 12 12 22</div>
                            <div className="text-sm mb-2">Apr 20, 2024 - 22.00</div>
                            <div className="flex justify-between">
                                <div className="font-bold">IDR 139.000</div>
                            </div>
                        </div>
                        <div className="min-w-20">
                            24 person
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
interface AddUserFormProps {
    enableModal: boolean
}

function AddUserForm(props: AddUserFormProps) {

    const { findUser } = useUser();
    const methods = useForm({
        defaultValues: {
            username: undefined,
        },
        mode: 'onBlur',
    });

    const [showError, setShowError] = useState(false);
    const [username, setUsername] = useState('');

    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setUsername(e.target.value);
    };

    const [isAddUserEnabled, setIsAddUserEnabled] = useState(false);

    const handleFindUser = async (form: any) => {
        try {
            const findExistingUser = await findUser(username);
            setShowError(false);
            setIsAddUserEnabled(true); // Enable "Add User" button

        } catch (err) {
            setShowError(true);
            setIsAddUserEnabled(false); // Disable "Add User" button

            console.log("error:", err);
        }
    };
    const addUser = async (form: any) => {
        try {
            // const saveUser = await saveUser(username);
            alert(username);


        } catch (err) {

            console.log("error:", err);
        }
    };

    const handleAddUser = () => {
        methods.handleSubmit(addUser)();
    };

    return (
        <Modal title="Add Peer" show={props.enableModal}>
            <form>
                <div className="flex flex-col">
                    <input
                        {...methods.register('username')}
                        name="username"
                        inputMode="text"
                        className=
                        "border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-emerald-100 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        placeholder="username"
                        onChange={handleChange} // add onChange event to update username state

                    />
                    {showError && <p className="text-red-500">User not found</p>}

                </div>
                <div className="flex mt-2">
                    <button
                        type="button"
                        onClick={() => handleFindUser(username)}
                        className="h-12 border-black border-2 p-2.5 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF]"
                    >
                        Find User
                    </button>
                    <button
                        type="button"
                        onClick={handleAddUser}
                        className={`h-12 border-black border-2 p-2.5 ml-2 ${isAddUserEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        disabled={!isAddUserEnabled}
                    >
                        Add User
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function FriendList() {

    const [showModal, setShowModal] = useState(false);
    const { peers } = useUser();

    return (
        <div className="p-4">
            <div className="flex flex-row my-2 space-x-2">
                <div className="bg-lime-500 border-black border-2 p-2  flex-grow">
                    <h1 className="text-black text-2xl font-bold ">Peers</h1>
                </div>
                <button
                    className=" border-black border-2 p-2.5 bg-lime-500 hover:bg-lime-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-lime-700"
                >
                    More
                </button>
            </div>
            <div className="flex flex-row overflow-x-auto border-black border-2 bg-gray-100 p-4 justify-center space-x-4">
                {JSON.stringify(peers)}
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
                <div className="items-center flex flex-col">
                    <button
                        onClick={() => setShowModal(!showModal)}
                        className="bg-green-500 hover:bg-green-700 border-black border-2 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white font-bold py-2 px-4 rounded-full flex items-center justify-center h-16 w-16">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.8425 24V0H13.1575V24H10.8425ZM0 13.1664V10.8336H24V13.1664H0Z" fill="black" />
                        </svg>
                    </button>
                </div>
            </div>
            <AddUserForm enableModal={showModal} />
        </div>
    );
}

function DetailActionCard() {
    const navigate = useNavigate();
    const cc = "IDR";
    const balance = currency(0.00, { symbol: cc, pattern: '! #' });
    const settlementEnabled = balance.value !== 0.00;

    const onNewSplitClicked = (e: any) => {
        e.preventDefault();
        navigate('/expense/new');
    };

    const onSettleUpClicked = (e: any) => {
        e.preventDefault();

    };

    return (
        <section className="p-4 mx-auto">
            <div className="flex flex-col p-4 border-black border-2 rounded-md shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-gray-100">
                <div className="flex flex-col items-center p-10">
                    <h2 className="text-lg">Balance</h2>
                    <h2 className="text-2xl font-bold">{balance.format()}</h2>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex flex-row space-x-2">
                        <button
                            onClick={onSettleUpClicked}
                            disabled={!settlementEnabled}
                            className="font-bold border-black border-2 p-2.5 bg-lime-500 hover:bg-lime-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-lime-700"
                        >
                            Settle Up
                        </button>
                        <button
                            onClick={onNewSplitClicked}
                            className="font-bold border-black border-2 p-2.5 bg-lime-500 hover:bg-lime-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-lime-700"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.8425 24V0H13.1575V24H10.8425ZM0 13.1664V10.8336H24V13.1664H0Z" fill="black" />
                            </svg>
                            {/* <span>New Split</span> */}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

function Header() {
    return (
        <header className="h-70 flex flex-row justify-between items-center bg-lime-500 border-black border-b-2 p-2.5">
            <h1 className="text-lime-900 text-5xl font-black">URUNAN</h1>
            <img
                src="https://thenational-the-national-prod.cdn.arcpublishing.com/resizer/v2/JY63BH7DXZC33K4TARQXIN3X34.jpg?smart=true&auth=0c17d44312353c4c8dd807c19ced8c007c671a84d05c136ea71fa6b36b5e5737&width=100&height=100"
                className="rounded-full w-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                alt="Profile"
            />
        </header>
    );
};