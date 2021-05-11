import React from "react";
import { AutocompleteProps, AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import { AutocompleteChangeReason, AutocompleteCloseReason, FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { InputProps, TextFieldProps } from "@material-ui/core";
/**
 * Used to distinguish free solo entries from string values.
 */
export declare class FreeSoloValue extends String {
    constructor(value: string);
}
/**
 * Options are wrapped to distinguish free solo entries from string
 * options, this is used internally only.
 */
declare class Option<T> {
    readonly option: T;
    constructor(option: T);
    valueOf(): T;
    toString(): string;
}
/**
 * Indicates an option is a branch node.
 */
export declare class BranchOption<TBranchOption> extends Option<TBranchOption> {
}
export declare type BranchSelectReason = Extract<AutocompleteChangeReason, "select-option"> | Extract<AutocompleteCloseReason, "escape">;
export declare type BranchSelectDirection = "up" | "down";
export declare type FreeSoloValueMapping<FreeSolo extends boolean | undefined> = FreeSolo extends true ? FreeSoloValue : never;
export declare type TreeSelectTextFieldProps = Omit<TextFieldProps, keyof AutocompleteRenderInputParams | Exclude<keyof AutocompleteProps<unknown, undefined, undefined, undefined>, "placeholder"> | "defaultValue" | "multiline" | "onChange" | "rows" | "rowsMax" | "select" | "SelectProps" | "value"> & {
    InputProps?: Omit<InputProps, keyof TextFieldProps["InputProps"]>;
};
export declare type TreeSelectProps<T, TBranchOption, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Pick<AutocompleteProps<T, Multiple, DisableClearable, false>, "defaultValue" | "getOptionSelected"> & Pick<AutocompleteProps<T | FreeSoloValueMapping<FreeSolo>, Multiple, DisableClearable, false>, "onChange" | "renderTags" | "value"> & Pick<AutocompleteProps<T | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "getOptionDisabled" | "groupBy" | "onHighlightChange" | "options"> & Pick<AutocompleteProps<T | FreeSoloValueMapping<FreeSolo> | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "getOptionLabel"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "defaultValue" | "filterOptions" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "onChange" | "onHighlightChange" | "renderTags" | "value" | "filterOptions" | "freeSolo" | "loadingText" | "options" | "renderInput" | "renderOption" | "placeholder"> & {
    branchPath?: BranchOption<TBranchOption>[];
    enterBranchText?: string;
    exitBranchText?: string;
    /**
     * @returns `true` to keep option and `false` to filter.
     */
    filterOptions?: (option: T | BranchOption<TBranchOption>, state: FilterOptionsState<T | BranchOption<TBranchOption>>) => boolean;
    freeSolo?: FreeSolo;
    loadingText?: string;
    onBranchChange: (event: React.ChangeEvent<Record<string, unknown>>, branchOption: BranchOption<TBranchOption> | undefined, branchPath: BranchOption<TBranchOption>[], direction: BranchSelectDirection, reason: BranchSelectReason) => void | Promise<void>;
    textFieldProps?: TreeSelectTextFieldProps;
    /**
     * Goes up one branch on escape key press; unless at root, then default
     * MUI Autocomplete behavior.
     * */
    upBranchOnEsc?: boolean;
};
declare const TreeSelect: <T, TBranchOption, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(props: TreeSelectProps<T, TBranchOption, Multiple, DisableClearable, FreeSolo>) => JSX.Element;
export default TreeSelect;
