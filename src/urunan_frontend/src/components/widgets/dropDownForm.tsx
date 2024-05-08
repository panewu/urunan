import { Controller, useFormContext } from "react-hook-form";
import { DropDown, DropDownProps } from "./dropDown";
import React, { forwardRef, useMemo } from "react";

interface DropDownFormProps extends DropDownProps {
    name: string
}

export function DropDownForm({ name, ...props }: DropDownFormProps) {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => <DropDown {...props} {...field} />}
        />
    );
}