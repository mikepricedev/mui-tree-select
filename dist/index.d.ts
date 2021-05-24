import React from "react";
import { AutocompleteProps, AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import { AutocompleteChangeReason, AutocompleteCloseReason, FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { InputProps, TextFieldProps } from "@material-ui/core";
/**
 * Used to distinguish free solo entries from string values.
 */
export declare class FreeSoloValue<TBranchOption = any> extends String {
    readonly value: string;
    readonly branchPath: BranchOption<TBranchOption>[];
    constructor(value: string, branchPath?: BranchOption<TBranchOption>[]);
}
/**
 * Wrapper for all option values that includes the branch path to the option.
 */
export declare class Value<T, TBranchOption = any> {
    readonly value: T;
    readonly branchPath: BranchOption<TBranchOption>[];
    constructor(value: T, branchPath?: BranchOption<TBranchOption>[]);
    valueOf(): T;
    toString(): string;
}
/**
 * Indicates an option is a branch node.
 */
export declare class BranchOption<TBranchOption> {
    readonly value: TBranchOption;
    constructor(value: TBranchOption);
    valueOf(): TBranchOption;
    toString(): string;
}
export declare const mergeInputStartAdornment: (action: "append" | "prepend", adornment: React.ReactNode, inputProps: InputProps) => InputProps;
export declare const mergeInputEndAdornment: (action: "append" | "prepend", adornment: React.ReactNode, inputProps: InputProps) => InputProps;
/**
 * Renders a TextField
 */
export declare const defaultInput: (params: TextFieldProps | AutocompleteRenderInputParams) => JSX.Element;
export declare type BranchSelectReason = Extract<AutocompleteChangeReason, "select-option"> | Extract<AutocompleteCloseReason, "escape">;
export declare type BranchSelectDirection = "up" | "down";
export declare type FreeSoloValueMapping<FreeSolo extends boolean | undefined, TBranchOption> = FreeSolo extends true ? FreeSoloValue<TBranchOption> : never;
export declare type TreeSelectProps<T, TBranchOption, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Pick<AutocompleteProps<Value<T, TBranchOption>, Multiple, DisableClearable, false>, "getOptionSelected"> & Pick<AutocompleteProps<T | Value<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "defaultValue"> & Pick<AutocompleteProps<Value<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "onChange" | "renderTags"> & Pick<AutocompleteProps<T | Value<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "value"> & Pick<AutocompleteProps<Value<T, TBranchOption> | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "getOptionDisabled" | "groupBy" | "onHighlightChange"> & Pick<AutocompleteProps<T | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "options"> & Pick<AutocompleteProps<Value<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption> | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "getOptionLabel"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "defaultValue" | "filterOptions" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "onChange" | "onHighlightChange" | "renderTags" | "value" | "filterOptions" | "freeSolo" | "loadingText" | "noOptionsText" | "options" | "renderInput" | "renderOption" | "placeholder"> & {
    branchPath?: BranchOption<TBranchOption>[];
    enterBranchText?: string;
    exitBranchText?: string;
    /**
     * @returns `true` to keep option and `false` to filter.
     */
    filterOptions?: (option: Value<T, TBranchOption> | BranchOption<TBranchOption>, state: FilterOptionsState<Value<T, TBranchOption> | BranchOption<TBranchOption>>) => boolean;
    freeSolo?: FreeSolo;
    loadingText?: string;
    noOptionsText?: string;
    onBranchChange: (event: React.ChangeEvent<Record<string, unknown>>, branchOption: BranchOption<TBranchOption> | undefined, branchPath: BranchOption<TBranchOption>[], direction: BranchSelectDirection, reason: BranchSelectReason) => void | Promise<void>;
    renderInput?: (params: AutocompleteRenderInputParams | TextFieldProps) => JSX.Element;
    /**
     * Goes up one branch on escape key press; unless at root, then default
     * MUI Autocomplete behavior.
     * */
    upBranchOnEsc?: boolean;
};
declare const TreeSelect: <T, TBranchOption, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(props: TreeSelectProps<T, TBranchOption, Multiple, DisableClearable, FreeSolo>) => JSX.Element;
export default TreeSelect;
