import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function Login() {
    const { login, isLoading } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        login();
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-200 mb-6">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-gray-100 rounded-lg py-2 font-semibold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
                >
                    Login
                </button>
            </form>
        </div>
    );
}