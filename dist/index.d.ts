import React from "react";
import { AutocompleteProps, AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import { AutocompleteChangeReason, AutocompleteCloseReason, FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { InputProps, TextFieldProps } from "@material-ui/core";
/**
 * Used to distinguish free solo entries from string values.
 */
export declare class FreeSoloValue<TBranchOption = any> extends String {
    readonly branchPath: BranchOption<TBranchOption>[];
    constructor(value: string, branchPath?: BranchOption<TBranchOption>[]);
}
declare abstract class BaseOption<T> {
    #private;
    constructor(value: T);
    valueOf(): T;
    toString(): string;
}
/**
 * Wrapper for all option values that includes the branch path to the option.
 */
export declare class Option<T, TBranchOption = any> extends BaseOption<T> {
    readonly branchPath: BranchOption<TBranchOption>[];
    constructor(value: T, branchPath?: BranchOption<TBranchOption>[]);
}
/**
 * Indicates an option is a branch node.
 */
export declare class BranchOption<TBranchOption> extends BaseOption<TBranchOption> {
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
export declare type TreeSelectProps<T, TBranchOption, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Pick<AutocompleteProps<T | Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "defaultValue"> & Pick<AutocompleteProps<Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "onChange" | "renderTags"> & Pick<AutocompleteProps<T | Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "value"> & Pick<AutocompleteProps<Option<T, TBranchOption> | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "onHighlightChange"> & Pick<AutocompleteProps<T | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "options"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "defaultValue" | "filterOptions" | "options" | "onChange" | "onHighlightChange" | "renderTags" | "value" | "filterOptions" | "freeSolo" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "loadingText" | "noOptionsText" | "renderInput" | "renderOption" | "placeholder"> & {
    branchPath?: BranchOption<TBranchOption>[];
    enterBranchText?: string;
    exitBranchText?: string;
    /**
     * @returns `true` to keep option and `false` to filter.
     */
    filterOptions?: (option: Option<T, TBranchOption> | BranchOption<TBranchOption>, state: FilterOptionsState<Option<T, TBranchOption> | BranchOption<TBranchOption>>) => boolean;
    freeSolo?: FreeSolo;
    getOptionLabel?: (option: T | BranchOption<TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, branchPath?: BranchOption<TBranchOption>[]) => string;
    getOptionDisabled?: (option: T | BranchOption<TBranchOption>, branchPath?: BranchOption<TBranchOption>[]) => boolean;
    getOptionSelected?: (option: T, value: T, branchPath?: {
        option: BranchOption<TBranchOption>[];
        value: BranchOption<TBranchOption>[];
    }) => boolean;
    groupBy?: (option: T | BranchOption<TBranchOption>, branchPath?: BranchOption<TBranchOption>[]) => string;
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
