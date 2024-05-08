import { buttonDisabledArguments } from "./views";

export { buttonDisabledArguments };

function replacer(key: any, value: any) {
    if (typeof value === 'bigint') {
        return {
            __type: 'bigint',
            __value: value.toString()
        };
    } else {
        return value;
    }
}

function reviver(key: any, value: any) {
    if (value && value.__type == 'bigint') {
        return BigInt(value.__value);
    }
    return value;
}

export const jsonStringify = (obj: any) => {
    return JSON.stringify(obj, replacer);
};

export const jsonParse = (s: string) => {
    return JSON.parse(s, reviver);
};
