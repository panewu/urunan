import { hexColorFromNumber, hashCode } from "src/utils";

interface AvatarProps {
    username: string;
    avatarUrl: string;
    showName?: boolean;
}
export function Avatar({ avatarUrl, username, showName = true }: AvatarProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            {
                avatarUrl ? (
                    <img
                        src={avatarUrl}
                        className="rounded-full w-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] "
                        alt="Profile"
                    />
                ) : (
                    <div
                        className="flex items-center justify-center rounded-full w-16 h-16 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold"
                        style={{ backgroundColor: `${hexColorFromNumber(hashCode(username))}` }}
                    >
                        {username && username[0].toUpperCase()}
                    </div>
                )
            }
            {
                showName && <div className="text-center font-semibold text-sm">{username}</div>
            }
        </div>
    );
}