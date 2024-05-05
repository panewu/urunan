import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-400">
            <div className="flex flex-col items-center space-y-8 p-8 justify-center border-black border-2 bg-gray-100 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-bold ">Oops! Page not found.</h1>
                <p className="text-lg mt-4">It seems you've stumbled upon a path that doesn't exist.</p>
                <Link
                    to="/"
                    className="h-12 border-black border-2 p-2.5 bg-lime-500 hover:bg-lime-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-lime-700"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}