import React from "react";
import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { AutocompleteChangeReason, AutocompleteCloseReason, FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { TextFieldProps } from "@material-ui/core";
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
export declare class BranchOption<T> extends Option<T> {
}
export declare type BranchSelectReason = Extract<AutocompleteChangeReason, "select-option"> | Extract<AutocompleteCloseReason, "escape">;
export declare type BranchSelectDirection = "up" | "down";
export declare type FreeSoloValueMapping<FreeSolo extends boolean | undefined> = FreeSolo extends true ? FreeSoloValue : never;
export declare type TreeSelectProps<T, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Pick<AutocompleteProps<T, Multiple, DisableClearable, false>, "defaultValue" | "getOptionSelected"> & Pick<AutocompleteProps<T | FreeSoloValueMapping<FreeSolo>, Multiple, DisableClearable, false>, "onChange" | "renderTags" | "value"> & Pick<AutocompleteProps<T | BranchOption<T>, Multiple, DisableClearable, false>, "getOptionDisabled" | "groupBy" | "onHighlightChange" | "options"> & Pick<AutocompleteProps<T | FreeSoloValueMapping<FreeSolo> | BranchOption<T>, Multiple, DisableClearable, false>, "getOptionLabel"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "defaultValue" | "filterOptions" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "onChange" | "onHighlightChange" | "renderTags" | "value" | "filterOptions" | "freeSolo" | "loadingText" | "options" | "renderInput" | "renderOption"> & {
    branchPath?: BranchOption<T>[];
    enterBranchText?: string;
    exitBranchText?: string;
    /**
     * @returns `true` to keep option and `false` to filter.
     */
    filterOptions?: (option: T | BranchOption<T>, state: FilterOptionsState<T | BranchOption<T>>) => boolean;
    freeSolo?: FreeSolo;
    loadingText?: string;
    onBranchChange: (event: React.ChangeEvent<Record<string, unknown>>, branchOption: BranchOption<T> | undefined, branchPath: BranchOption<T>[], direction: BranchSelectDirection, reason: BranchSelectReason) => void | Promise<void>;
    textFieldProps?: Omit<TextFieldProps, keyof AutocompleteProps<T | FreeSoloValueMapping<FreeSolo>, Multiple, DisableClearable, false> | "defaultValue" | "multiline" | "onChange" | "rows" | "rowsMax" | "select" | "SelectProps" | "value">;
    /**
     * Goes up one branch on escape key press; unless at root, then default
     * MUI Autocomplete behavior.
     * */
    upBranchOnEsc?: boolean;
};
declare const TreeSelect: <T, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(props: TreeSelectProps<T, Multiple, DisableClearable, FreeSolo>) => JSX.Element;
export default TreeSelect;
