export function Home() {
    return (
        <div>
            <div className="bg-gray-100 min-h-screen">
                <div className="container mx-auto py-6 px-4">
                    {/* <Header /> */}

                    <div className="mt-6">
                        <Wallet />
                    </div>

                    <div className="mt-8">
                        <FriendList />
                    </div>

                    <div className="mt-8">
                        <History />
                    </div>
                </div>
            </div>
        </div>
    );
}

function History() {
    return (
        <div className="container mx-auto py-6 px-4">
            <h1>History</h1>
            <div className="mt-4 max-h-96 overflow-y-auto">
                {Array.from({ length: 10 }, (_, index) => (
                    <div key={index} className="mb-4">
                        <div className="bg-white p-4 rounded-md">
                            <div className="mb-2 font-semibold">Madhang</div>
                            <div className="text-xs mb-2">Apr 20, 2024 - 22.00</div>
                            <div className="flex justify-between">
                                <div className="font-bold">IDR 139.000</div>
                                <div className="font-bold text-red-500">20% Paid</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FriendList() {
    return (
        <div className="container mx-auto py-6 px-4">
            <h1>Friend List</h1>
            <div className="mt-4 flex overflow-x-auto">
                {Array.from({ length: 10 }, (_, index) => (
                    <div key={index} className="mr-4">
                        <div className="mb-2">
                            <img
                                src="https://thenational-the-national-prod.cdn.arcpublishing.com/resizer/v2/JY63BH7DXZC33K4TARQXIN3X34.jpg?smart=true&auth=0c17d44312353c4c8dd807c19ced8c007c671a84d05c136ea71fa6b36b5e5737&width=100&height=100"
                                className="rounded-full w-16 h-16"
                                alt="Profile"
                            />
                        </div>
                        <div>
                            Joe
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
function Wallet() {
    return (
        <div className="container mx-auto py-6 px-4">
            <div className="bg-white p-6 rounded-md">
                <h1>Your Wallet</h1>
                <span>IDR 1,000,000</span>
                <div className="mt-4 flex justify-between">
                    <button></button>
                    <button></button>
                </div>
            </div>
        </div>
    );
};

function Header() {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <h1>Hi Fulan</h1>
            </div>
            <div>
                setting
            </div>
        </div>
    );
};