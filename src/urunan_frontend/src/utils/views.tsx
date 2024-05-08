import classNames from "classnames"

export function buttonDisabledArguments(disabled: boolean): classNames.ArgumentArray {
    return [
        { 'bg-gray-400 opacity-70': disabled },
    ];
}