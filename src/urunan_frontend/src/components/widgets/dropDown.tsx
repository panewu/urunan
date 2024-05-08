
import { InputHTMLAttributes, useState } from "react";

interface DropDownPropsItem {
    name: string;
    label: string;
}

export interface DropDownProps extends InputHTMLAttributes<HTMLInputElement> {
    items: DropDownPropsItem[];
    defaultLabel: string;
    onItemSelected?: (item: DropDownPropsItem) => void;
    onItemBlur?: () => void;
}

export function DropDown({ items, defaultLabel, onItemSelected, onItemBlur, ...props }: DropDownProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<DropDownPropsItem>({ name: 'default', label: defaultLabel });
    return (
        <div {...props} className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex w-32 justify-center gap-x-1.5 bg-lime-500 hover:bg-lime-600 px-3 py-2 border-black border-2 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() => setOpen(!open)}
                >
                    {value.label}
                    <svg
                        className="mt-1 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            <div
                className={
                    ` absolute right-0 z-10 mt-2 origin-top-right bg-white focus:outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)] border-black border-2 divide-y divide-black ${!open ? 'hidden' : ''}`
                }
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
            >
                <div role="none">
                    {
                        items.map((item) => (
                            <button
                                key={item.name}
                                onBlur={() => onItemBlur && onItemBlur()}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpen(false);
                                    setValue(item);
                                    onItemSelected && onItemSelected(item);
                                }}
                                className="block w-32 px-4 py-2 text-sm border-black border-b-2 hover:bg-emerald-500 hover:font-medium"
                                role="menuitem"
                                id={`menu-item-${item.name}`}
                            >
                                {item.label}
                            </button>
                        ))
                    }
                </div>
            </div>
        </div >
    );
};
