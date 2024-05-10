import { hexColorFromNumber, hashCode } from "src/utils";

interface AvatarProps {
    username: string;
    avatarUrl: string;
}
export function Avatar(props: AvatarProps) {
    return (
        <>
            {
                props.avatarUrl ? (
                    <img
                        src={props.avatarUrl}
                        className="rounded-full w-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] "
                        alt="Profile"
                    />
                ) : (
                    <div
                        className="flex items-center justify-center rounded-full w-16 h-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold"
                        style={{ backgroundColor: `${hexColorFromNumber(hashCode(props.username))}` }}
                    >
                        {props.username && props.username[0].toUpperCase()}
                    </div>
                )
            }
        </>
    );
}