import classNames from "classnames";
import { InputHTMLAttributes, useState } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    onChecked: (checked: boolean) => void;
}

export function Checkbox({ checked: checkedDefault, onChecked, ...props }: CheckboxProps) {
    const [checked, setChecked] = useState(checkedDefault || false);
    return (
        <>
            <label>
                <input
                    {...props}
                    type="checkbox"
                    className={classNames(
                        "appearance-none outline-none block relative text-center cursor-pointer m-auto w-5 h-5 before:rounded-sm before:block before:absolute before:content-[''] before:bg-lime-500 before:w-5 before:h-5 before:border-black before:border-2 before:hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]  after:block after:content-[''] after:absolute after:left-1.5 after:top-0.5 after:w-2 after:h-3 after:border-black after:border-r-2 after:border-b-2 after:origin-center after:rotate-45",
                        { "after:opacity-1 before:checked:bg-lime-600": checked },
                        { "after:opacity-0": checked === false }
                    )}
                    defaultChecked={checked}
                    onClick={() => {
                        const checkedChanges = !checked;
                        setChecked(checkedChanges);
                        onChecked(checkedChanges);
                    }}
                />
            </label>
        </>
    );
}