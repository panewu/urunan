import { useState } from "react";

export const useLocalStorage = () => {
    const [value, setValue] = useState<string | null>(null);

    const setItem = (k: string, v: string) => {
        localStorage.setItem(k, v);
        setValue(v);
    };

    const getItem = (k: string) => {
        const v = localStorage.getItem(k);
        setValue(v);
        return v;
    };

    const removeItem = (k: string) => {
        localStorage.removeItem(k);
        setValue(null);
    };

    return { value, setItem, getItem, removeItem, };
};
