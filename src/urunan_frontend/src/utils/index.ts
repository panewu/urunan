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

export function hashCode(s: string) {
    return s.split('').reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
}

export function hexColorFromNumber(num: number) {
    const hashCode = Math.abs(num);
    let hexString = hashCode.toString(16);

    while (hexString.length < 6) {
        hexString = "0" + hexString;
    }
    if (hexString.length > 6) {
        hexString = hexString.substr(hexString.length - 6);
    }
    return "#" + hexString + "AA";
}
