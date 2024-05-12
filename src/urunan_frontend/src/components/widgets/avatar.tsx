import classNames from "classnames";
import { useState } from "react";
import { hexColorFromNumber, hashCode } from "src/utils";

interface AvatarProps {
    username: string;
    avatarUrl: string;
    showName?: boolean;
    labelName?: string;
    shadow?: boolean;
}
export function Avatar({ avatarUrl, username, labelName, showName = true, shadow = false }: AvatarProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            {
                avatarUrl ? (
                    <img
                        src={avatarUrl}
                        className={
                            classNames('rounded-full w-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
                                { 'shadow-[2px_2px_0px_rgba(0,0,0,1)]': shadow })
                        }
                        alt="Profile"
                    />
                ) : (
                    <div
                        className={
                            classNames('flex items-center justify-center rounded-full w-16 h-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold',
                                { 'shadow-[2px_2px_0px_rgba(0,0,0,1)]': shadow })
                        }
                        style={{ backgroundColor: `${hexColorFromNumber(hashCode(username))}` }}
                    >
                        {username && username[0].toUpperCase()}
                    </div>
                )
            }
            {
                showName && <div className="text-center font-semibold text-sm">{labelName ? labelName : username}</div>
            }
        </div>
    );
}

interface AvatarCheckmarkProps extends AvatarProps {
    checked?: boolean;
    onChecked?: (checked: boolean) => void;
}

export function AvatarCheckmark({ checked: checkedDefault, onChecked, ...props }: AvatarCheckmarkProps) {
    const [checked, setChecked] = useState<boolean>(checkedDefault || false);

    return (
        <div className="relative w-16 mx-7" onClick={() => {
            onChecked && onChecked(!checked);
            setChecked(!checked);
        }}>
            <Avatar
                {...props}
                shadow={checked}
            />
            <div
                hidden={!checked}
                className="absolute w-6 h-6 right-0 top-0 rounded-full border-2 border-black bg-lime-500 text-black text-xs text-center font-bold">
                ✓
            </div>

        </div>
    )
}